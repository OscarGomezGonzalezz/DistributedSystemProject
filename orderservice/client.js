const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');


const packageDefinition = protoLoader.loadSync("confirmation.proto", {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const confirmationProto = grpc.loadPackageDefinition(packageDefinition).confirmation;

// Create a client
const client = new confirmationProto.Confirmation(
    "mongoStack_confirmation-grpc-service:3335",
    grpc.credentials.createInsecure()
);

async function callConfirmationServiceRPC(isin) {
    return new Promise((resolve, reject) => {
        // Attempt gRPC call
        client.ConfirmOrder({ isin: isin }, (error, response) => {
            if (error) {
                console.error("gRPC request failed:", error);
                reject(error); // Reject the promise if the gRPC request fails
            } else {
                resolve(response); // Resolve the promise if gRPC succeeds
            }
        });
    });
}

    module.exports = {
        callConfirmationServiceRPC
    }
