const mongoose = require('../dbConnectionMongo'); // Import the Mongoose instance

const { callConfirmationServiceRPC } = require('../client.js'); // Import the RPC function

// Define the Orders schema
const orderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    isin: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, default: 0 },
    state: { type: Number, default: 0 }, // 0: created, 1: confirmed, 2: executed, 3: sold
}, { timestamps: true }); // Adds createdAt and updatedAt fields

// Create the Order model
const Order = mongoose.model('Order', orderSchema);

const allowedTransitions = {
    0: [1], // created -> confirmed
    1: [2], // confirmed -> executed
    2: [3], // executed -> sold
};

// Function to insert a single order
async function insertOrder(name, isin, quantity, price = 0, state = 0) {
    try {
        const order = new Order({ name, isin, quantity, price, state });
        const savedOrder = await order.save();
        return savedOrder;
    } catch (error) {
        console.error("Error inserting order:", error);
        throw error;
    }
}

// Function to insert multiple orders
async function insertOrderOverload(name, isin, quantity) {
    try {
        const orders = Array.from({ length: 100 }, () => ({
            name, isin, quantity, price: 0, state: 0,
        }));
        const result = await Order.insertMany(orders);
        return result;
    } catch (error) {
        console.error("Error inserting multiple orders:", error);
        throw error;
    }
}

// Function to fetch all orders with optional state filtering
async function getAllOrders(state) {
    try {
        const filter = state !== undefined ? { state } : {};
        const orders = await Order.find(filter);
        return orders;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
}

// Function to fetch an order by ID
async function getOrderById(id) {
    try {
        const order = await Order.findById(id);
        return order || null;
    } catch (error) {
        console.error(`Error fetching order by ID ${id}:`, error);
        throw error;
    }
}

// Function to update an order's quantity
async function updateOrderQuantity(id, quantity) {
    try {
        const order = await Order.findOneAndUpdate(
            { _id: id, state: 0 },
            { quantity },
            { new: true }
        );
        return order;
    } catch (error) {
        console.error("Error updating order quantity:", error);
        throw error;
    }
}

// Function to update an order's state
async function updateOrderState(id, newState) {
    try {
        const currentOrder = await getOrderById(id);
        if (!currentOrder) return null;

        const { state: currentState, isin } = currentOrder;

        // Validate state transition
        if (!allowedTransitions[currentState] || !allowedTransitions[currentState].includes(newState)) {
            throw new Error(`Invalid state transition from ${currentState} to ${newState}`);
        }

        // Handle confirmation service logic if transitioning to 'confirmed' state
        if (currentState === 0 && newState === 1) {
            const confirmationData = await callConfirmationServiceRPC(isin);
            if (!confirmationData || !confirmationData.confirmed) {
                throw new Error("Order confirmation failed");
            }
            currentOrder.price = confirmationData.price;
        }

        currentOrder.state = newState;
        const updatedOrder = await currentOrder.save();
        return updatedOrder;
    } catch (error) {
        console.error("Error updating order state:", error);
        throw error;
    }
}

// Function to delete an order (only if state is 0 or 1)
async function deleteOrder(id) {
    try {
        const result = await Order.deleteOne({ _id: id, state: { $in: [0, 1] } });
        return result.deletedCount > 0 ? id : null;
    } catch (error) {
        console.error("Error deleting order:", error);
        throw error;
    }
}

module.exports = {
    insertOrder,
    insertOrderOverload,
    getAllOrders,
    getOrderById,
    updateOrderQuantity,
    updateOrderState,
    deleteOrder,
};
