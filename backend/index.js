import express from 'express';
import {dbConnect} from './config/database.js';
import cors from 'cors';

import morgan from 'morgan';
import productsRoutes from './routes/products.js';
import categoryRoutes from './routes/category.js'; 
import usersRoutes from './routes/users.js';
import orderRoutes from './routes/order.js'
import { stripeWebhook } from "./controllers/orders.js";
import cartRoutes from './routes/cart.js';
import dotenv from 'dotenv';



var corsOptions = {
  origin: process.env.WEBAPP_URL,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};


dotenv.config(); 
const app = express();
const PORT = process.env.PORT || 5000; 

app.post(
  "/api/orders/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors(corsOptions ));
app.use(morgan("common"));

app.use('/api/products', productsRoutes); 
app.use('/api/categories', categoryRoutes); 
app.use('/auth/users', usersRoutes); 
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);

const startServer = async () => {
  await dbConnect();

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();