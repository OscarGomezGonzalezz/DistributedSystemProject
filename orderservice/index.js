const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const { 
    insertOrder, 
    getAllOrders, 
    getOrderById, 
    updateOrderQuantity, 
    updateOrderState, 
    deleteOrder,
    insertOrderOverload
} = require('./Models/OrderModelMongo');



app.post('/orders', async (req, res) => {
    const { name, isin, quantity } = req.body;

    if (!name || !isin || !quantity) {
        return res.status(400).send({ error: 'Name, ISIN, and Quantity are required.' });
    }

    try {
        const newOrder = await insertOrder(name, isin, quantity, 0, 0);
        res.status(200).send(newOrder);
    } catch (error) {
        res.status(500).send({ error: 'Error creating order.' });
    }
});

app.post('/orders/overload', async (req, res) => {
    const { name, isin, quantity } = req.body;
    if (!name || !isin || !quantity) {
        return res.status(400).send({ error: 'Name, ISIN, and Quantity are required.' });
    }
    try {

        insertOrderOverload(name, isin, quantity);
        // Send a response after all orders have been created
        res.status(201).send("All orders created successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("New order could not be created");
    }
});

app.get('/orders', async (req, res) => {
    const { state } = req.query;
    
    try {
        const orders = await getAllOrders(state);
        res.status(200).send(orders);
    } catch (error) {
        res.status(500).send({ error: 'Error retrieving orders.' });
    }
});

app.get('/orders/:order_id', async (req, res) => {
    const { order_id } = req.params;

    try {
        const order = await getOrderById(order_id);
        if (!order) {
            return res.status(404).send({ error: 'Order not found.' });
        }
        res.status(200).send(order);
    } catch (error) {
        res.status(500).send({ error: 'Error retrieving order.' });
    }
});

app.patch('/orders/:order_id/quantity', async (req, res) => {
    const { order_id } = req.params;
    const { quantity } = req.body;

    if (!quantity) {
        return res.status(400).send({ error: 'Quantity is required.' });
    }

    try {
        const updatedOrder = await updateOrderQuantity(order_id, quantity);
        res.status(200).send(updatedOrder);
    } catch (error) {
        res.status(500).send({ error: 'Error updating order quantity.' });
    }
});

app.patch('/orders/:order_id/state', async (req, res) => {
    const { order_id } = req.params;
    const { state } = req.body;

    if (!state) {
        return res.status(400).send({ error: 'State is required.' });
    }

    try {
        const updatedOrder = await updateOrderState(order_id, state);
        res.status(200).send(updatedOrder);
    } catch (error) {
        res.status(500).send({ error: 'Error updating order state.' });
    }
});

app.delete('/orders/:order_id', async (req, res) => {
    const { order_id } = req.params;

    try {
        const deletedOrder = await deleteOrder(order_id);
        res.status(200).send(deletedOrder);
    } catch (error) {
        res.status(500).send({ error: 'Error deleting order.' });
    }
});

const PORT = 3333;
app.listen(PORT, () => {
    console.info(`Server is running on http://localhost:${PORT}`);
});
