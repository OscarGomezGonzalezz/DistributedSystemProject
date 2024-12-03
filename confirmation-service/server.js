const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const { 
    ConfirmOrder
} = require('./service.js');

// Load the proto file
const packageDefinition = protoLoader.loadSync("confirmation.proto", {});
const gRPCObject = grpc.loadPackageDefinition(packageDefinition);
const confirmationPackage = gRPCObject.confirmation;


// Start the gRPC Server
function main() {
    const server = new grpc.Server();
    server.addService(confirmationPackage.Confirmation.service, { 
        ConfirmOrder
     });
    server.bindAsync("0.0.0.0:3335", grpc.ServerCredentials.createInsecure(), (err, bindPort) => {
        if (err) {
            console.error(`Error binding server:, ${err.message}`);
            return;
        }
        console.log(`ConfirmationService Server is running on port ${bindPort}`);
    });
}

main();
