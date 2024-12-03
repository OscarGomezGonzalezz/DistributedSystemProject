const db = require('../dbConnection')
const axios = require('axios');

const { callConfirmationServiceRPC } = require('../client.js');

const allowedTransitions = {
    0: [1], // created -> confirmed
    1: [2], // confirmed -> executed
    2: [3]  // executed -> sold
};
// Async function to add orders into the database
async function insertOrder(name, isin, quantity, price, state) {
    const query = `INSERT INTO Orders(name, isin, quantity, price, state) VALUES (?, ?, ?, ?, ?)`;
    const values = [name, isin, quantity, price, state];
    
    try {
      const [result] = await db.execute(query, values);
      const [orderRows] = await db.execute(`SELECT * FROM Orders WHERE order_id = ?`, [result.insertId]);
      return orderRows[0];
    } catch (error) {
      console.error("Error inserting data:", error);
      throw error;
    }
  }

async function insertOrderOverload(name, isin, quantity) {
   
    try {
        for (let i = 0; i < 1000; i++) {
            console.info('Starting order creation...');
            // Await the execution of the DB insert to ensure sequential execution
            const result = await db.execute(
            'INSERT INTO Orders(name, isin, quantity, price, state) VALUES (?,?,?,?,?)',[name, isin, quantity, 0, 0]);
            console.info(`New order with ID ${result[0].insertId} created`);
        }
        
    } catch (error) {
      console.error("Error inserting data:", error);
      throw error;
    }
}



// Async function to get all orders from the database
async function getAllOrders(state) {
    let query = `SELECT * FROM Orders`;
    const values = [];
    
    //We can filter by State
    if (state) {
        query += ` WHERE state = ?`;
        values.push(state);
    }

    try {
        const [results] = await db.execute(query, values);
        console.log(results);
        return results;

    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
}

/// Async function to get an order by ID
async function getOrderById(id) {
    const query = `SELECT * FROM Orders WHERE order_id = ?`;
    
    try {
        const [results] = await db.execute(query, [id]);
        const order = results[0] || null; // Return the first result if found, otherwise null
        console.log(`Fetched order by ID ${id}:`, order);
        return order;
    } catch (error) {
        console.error(`Error fetching order by ID ${id}:`, error);
        throw error; // Rethrow error to handle in route
    }
}
// Async function to update the quantity of an order
async function updateOrderQuantity(id, quantity) {
    const query = `UPDATE Orders SET quantity = ? WHERE order_id = ? AND state = 0`;
    
    try {
        const [result] = await db.execute(query, [quantity, id]);
        if (result.affectedRows === 0) return null; // No update if order not found or state not 0
        const updatedOrder = await getOrderById(id);
        console.log("Updated order quantity:", updatedOrder);
        return updatedOrder; // Return updated order
    } catch (error) {
        console.error("Error updating order quantity:", error);
        throw error; // Rethrow error to handle in route
    }
}


async function callConfirmationServiceHTTP(isin) {
    try {
    const response = await axios.get(`http://confirmation-service:3334/confirmation/${isin}`);
    return response.data;
    } catch (error) {
    console.error("Call to confirmation service could not be completed");
    }
    }
// Async function to update the state of an order
async function updateOrderState(id, newState) {
    
    try {
        const currentOrder = await getOrderById(id);
        if (!currentOrder) return null; // Si no existe el pedido, retornamos null
        
        const currentState = currentOrder.state;
        const isin = currentOrder.isin;
        
        // Verificamos si la transición es permitida
        if (!allowedTransitions[currentState] || !allowedTransitions[currentState].includes(newState)) {
            console.error(`Not allowed state transaction from state: ${currentState} to state: ${newState}`);
            throw new Error(`Not allowed state transaction from state: ${currentState} to state: ${newState}`);
        }
        if(currentState==0 && newState ==1){
            const confirmationData = await callConfirmationServiceRPC(isin);
            console.log(confirmationData);
            //const confirmationData = await callConfirmationServiceHTTP(isin);
            if (!confirmationData || !confirmationData.confirmed) {
                throw new Error("Order confirmation failed");
            }
            const price = confirmationData.price;
            // Realizamos el update ya que la transición es válida
            const query = `UPDATE Orders SET price = ? WHERE order_id = ?`;
            const [result] = await db.execute(query, [price, id]);

            if (result.affectedRows === 0) return null; // No update si no se encontró el pedido
        }

        const query = `UPDATE Orders SET state = ? WHERE order_id = ?`;
            const [result] = await db.execute(query, [newState, id]);

            if (result.affectedRows === 0) return null; // No update si no se encontró el pedido

        const updatedOrder = await getOrderById(id);
            console.log("Order state updated:", updatedOrder);
        return updatedOrder; // Retornamos el pedido actualizado
       
        
    } catch (error) {
        console.error("Error updating order state:", error);
        throw error; // Rethrow error to handle in route
    }
}

// Async function to delete an order
async function deleteOrder(id) {
    const query = `DELETE FROM Orders WHERE order_id = ? AND (state = 0 OR state = 1)`;
    
    try {
        const [result] = await db.execute(query, [id]);
        if (result.affectedRows === 0) {
            console.log('Order not deleted: Not found');
            return null;
        }
        const currentState = result[0].state;
        
        // error message if the state is not 0
        if (currentState !== 0) {
            console.log('Cannot delete order: State is not 0');
            return { error: 'Cannot delete order: Order state is not 0' };
        }
        console.log("Deleted order ID:", id);
        return id; // Return deleted order ID for confirmation
    } catch (error) {
        console.error("Error deleting order:", error);
        throw error; // Rethrow error to handle in route
    }
}




module.exports = {
    insertOrder,
    getAllOrders,
    getOrderById,
    updateOrderQuantity,
    updateOrderState,
    deleteOrder,
    insertOrderOverload
};