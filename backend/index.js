import dotenv from 'dotenv';
dotenv.config();

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

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: process.env.WEBAPP_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Database connection flag
let dbConnected = false;

// Middleware to connect database on first request
const connectDatabase = async (req, res, next) => {
  if (!dbConnected && process.env.NODE_ENV === 'production') {
    try {
      await dbConnect();
      dbConnected = true;
    } catch (error) {
      console.error('Database connection error:', error);
      return res.status(500).json({ error: 'Database connection failed' });
    }
  }
  next();
};

app.use(connectDatabase);

// Webhook must be before other middleware for raw body
app.post(
  "/api/orders/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors(corsOptions));
app.use(morgan("common"));

// Routes
app.use('/api/products', productsRoutes); 
app.use('/api/categories', categoryRoutes); 
app.use('/auth/users', usersRoutes); 
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running', env: process.env.NODE_ENV });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    status: err.status || 500,
  });
});

// Connect to database and start server for local development
const startServer = async () => {
  try {
    await dbConnect();
    dbConnected = true;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start server only in local development, not on Vercel
if (process.env.NODE_ENV !== 'production') {
  startServer();
}

// Export app for Vercel serverless
export default app;