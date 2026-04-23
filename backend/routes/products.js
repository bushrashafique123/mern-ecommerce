import express from 'express';
import { createProduct, updateProduct, deleteProduct, getProductById, getAllProducts,getProductsByCategory} from '../controllers/products.js';
import validateId from '../middlewares/validateId.js';
import {verifyToken} from '../middlewares/auth.js';
const router = express.Router();

router.post('/', verifyToken, createProduct);
router.get('/', getAllProducts); 
router.get('/:id', validateId, getProductById);
router.get("/category/:name", getProductsByCategory)
router.put('/:id', verifyToken, updateProduct);
router.delete('/:id', verifyToken, deleteProduct);

export default router;