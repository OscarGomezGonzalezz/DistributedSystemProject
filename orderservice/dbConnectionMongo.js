const mongoose = require('mongoose');

// MongoDB connection URI (replace with your actual credentials if needed)
const uri = 'mongodb://node:password1234@mongodb-service:27017/database1';

// Establish the connection
const connectToDatabase = async () => {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB successfully!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit the application if the connection fails
  }
};

// Call the connection function
connectToDatabase();

// Export the mongoose instance for use in other parts of the application
module.exports = mongoose;
