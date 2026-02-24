import express from 'express';
import { createUser, getUser, getAllUsers ,loginUser,changePassword,verifyOtp, updateUser, deleteUser, requestPasswordReset, resetPassword, deleteOwnAccount } from '../controllers/users.js';
import validateId from '../middlewares/validateId.js';
import {verifyToken,verifyTokenAndAdmin} from '../middlewares/auth.js';
import {apiRateLimit} from '../middlewares/api-ratelimit.js'; // Import rate limit middleware
const router = express.Router();


router.post('/register', apiRateLimit, createUser);
// Route for logging in a user
router.post('/login', apiRateLimit, loginUser);
// Route for verifying OTP
router.post('/verify-otp', apiRateLimit, verifyOtp);
// Route for getting all users
router.get('/users', verifyToken, getAllUsers);

// Password reset endpoints
router.post('/request-reset', apiRateLimit, requestPasswordReset);
router.post('/reset-password', apiRateLimit, resetPassword);

// Update user (admins can change role; controller enforces role-change permissions)
router.put('/:id', verifyToken, apiRateLimit, updateUser);

// Delete user (admin only)
router.delete('/:id', verifyTokenAndAdmin, apiRateLimit, deleteUser);

// Allow authenticated user to delete their own account (requires password)
router.post('/me/delete', verifyToken, apiRateLimit, deleteOwnAccount);

// Route for changing password
router.put('/change-password/:id', verifyToken, apiRateLimit, changePassword);
 
// Route for getting the current authenticated user
router.get('/me', verifyToken, getUser);

export default router;
