import express from 'express';
import { createProduct, updateProduct, deleteProduct, getProductById, getAllProducts } from '../controllers/products.js'; // Import the new method
import validateId from '../middlewares/validateId.js';
import {verifyToken} from '../middlewares/auth.js';
const router = express.Router();

router.post('/', verifyToken, createProduct);
router.get('/', getAllProducts); // Add route to get all products
router.get('/:id', validateId, getProductById);
router.put('/:id', verifyToken, updateProduct);
router.delete('/:id', verifyToken, deleteProduct);

export default router;