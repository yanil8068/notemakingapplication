import mongoose from "mongoose"; // Importing Mongoose, an ODM (Object Data Modeling) library for MongoDB

// Function to connect to the MongoDB database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("connected to db");
  } catch (error) {
    console.log("Error connecting to db", error);
  }
};

export default connectDB;
