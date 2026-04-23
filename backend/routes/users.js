import express from 'express';
import { createUser, getUser, getAllUsers ,loginUser,changePassword, updateUser, deleteUser, requestPasswordReset, resetPassword, deleteOwnAccount, verifyOtp } from '../controllers/users.js';
import validateId from '../middlewares/validateId.js';
import {verifyToken,verifyTokenAndAdmin} from '../middlewares/auth.js';
import {apiRateLimit} from '../middlewares/api-ratelimit.js'; 
const router = express.Router();


router.post('/register', apiRateLimit, createUser);
router.post('/login', apiRateLimit, loginUser);
router.post('/verify-otp', apiRateLimit, verifyOtp);
router.get('/users', verifyToken, getAllUsers);
router.post('/request-reset', apiRateLimit, requestPasswordReset);
router.post('/reset-password', apiRateLimit, resetPassword);
router.put('/:id', verifyToken, apiRateLimit, updateUser);
router.delete('/:id', verifyTokenAndAdmin, apiRateLimit, deleteUser);
router.post('/me/delete', verifyToken, apiRateLimit, deleteOwnAccount);
router.put('/change-password/:id', verifyToken, apiRateLimit, changePassword);
router.get('/me', verifyToken, getUser);

export default router;
