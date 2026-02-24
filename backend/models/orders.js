import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },

  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
      },
      name: String,
      price: Number,
      quantity: Number,
    },
  ],

  totalAmount: {
    type: Number,
    required: true,
  },

  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },

  orderStatus: {
    type: String,
    enum: ["processing", "shipped", "delivered", "cancelled"],
    default: "processing",
  },

  stripeSessionId: String,

}, { timestamps: true });

export default mongoose.model("Orders", orderSchema);