const mongoose = require('mongoose');

// MongoDB connection URI (replace with your actual credentials if needed)
const uri = 'mongodb://ndoe:password1234@mongodb-service:27017/database1';

// Options for the connection (optional but recommended)
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Establish the connection
const connectToDatabase = async () => {
  try {
    await mongoose.connect(uri, options);
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
