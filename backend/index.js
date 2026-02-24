import express from 'express';
import {dbConnect} from './config/database.js';
import cors from 'cors';

import morgan from 'morgan';
import productsRoutes from './routes/products.js';
import categoryRoutes from './routes/category.js'; 
import usersRoutes from './routes/users.js';
import orderRoutes from './routes/order.js'
import { stripeWebhook } from "./controllers/orders.js";
import dotenv from 'dotenv';



var corsOptions = {
  origin: process.env.WEBAPP_URL, 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
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
dbConnect();

app.use('/api/products', productsRoutes); // Register products routes
app.use('/api/categories', categoryRoutes); // Add category routes
app.use('/auth/users', usersRoutes); // Add users routes
app.use("/api/orders", orderRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});