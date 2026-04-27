import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

let mongooseConnection = null;

export const dbConnect = async () => {
  try {
    // Return existing connection if already connected
    if (mongooseConnection) {
      console.log("Using existing MongoDB connection");
      return mongooseConnection;
    }

    // Check if already connecting
    if (mongoose.connection.readyState === 1) {
      console.log("MongoDB already connected");
      return mongoose.connection;
    }

    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
    });
    
    mongooseConnection = connection;
    console.log("MongoDB connected successfully");
    return connection;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error; // Throw instead of process.exit() for serverless
  }
};