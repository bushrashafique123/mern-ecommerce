import express from "express";
import {
  createOrder,
  createCheckoutSession,
  stripeWebhook,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orders.js";

import { verifyToken, verifyTokenAndAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", verifyToken, createOrder);
router.post("/checkout", verifyToken, createCheckoutSession);
router.post("/webhook", stripeWebhook); // webhook route

router.get("/", verifyTokenAndAdmin, getAllOrders);
router.get("/:id", verifyToken, getSingleOrder);
router.put("/:id", verifyTokenAndAdmin, updateOrderStatus);
router.delete("/:id", verifyTokenAndAdmin, deleteOrder);

export default router;