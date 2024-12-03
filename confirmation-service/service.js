const grpc = require('@grpc/grpc-js');

const { 
    getPriceData
} = require('./ConfirmationModel');

async function ConfirmOrder(call, callback) {
    const { isin } = call.request;

    try {
        const dataPrice = await getPriceData(isin);
        console.log(dataPrice)
        if (!dataPrice) {
            return callback({
                code: grpc.status.NOT_FOUND,
                details: 'No price data available for the given ISIN',
            });
        }
        const price = Object.values(dataPrice)[0];

        // Confirmation logic
        const confirmed = true;
       

        // Return Protocol Buffer-compatible response
        return callback(null, {
            confirmed,
            message: "Order confirmed successfully",
            price: price,
        });
    } catch (error) {
        return callback({
            code: grpc.status.FAILED_PRECONDITION,
            details: error.message,
        });
    }
}

module.exports = {
    ConfirmOrder
};
