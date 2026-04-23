import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Mongodb connected successfully");
  } catch (error) {
    console.log("Mongodb connection failed:", error.message);
    process.exit(1); 
  }
};