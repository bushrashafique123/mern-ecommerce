import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const dbConnect = () => {
  mongoose
  .connect(process.env.MONGODB_URI)


  .then(() => {
    console.log("Mongodb connected successfully");
  })
  .catch((error) => {
    console.log("Mongodb connection failed:", error.message);
  })
}