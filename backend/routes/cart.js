import express from 'express';
import { getCart, addToCart } from '../controllers/cart.js';
import { verifyToken } from '../middlewares/auth.js';
import {removeItemFromCart,updateCartItemQuantity,clearCart}  from '../controllers/cart.js';

const router = express.Router();

router.get('/', verifyToken , getCart); 
router.post('/add', verifyToken , addToCart);
router.delete('/item/:productId', verifyToken, removeItemFromCart);
router.patch('/item/:productId', verifyToken, updateCartItemQuantity);
router.delete('/', verifyToken, clearCart);
export default router;