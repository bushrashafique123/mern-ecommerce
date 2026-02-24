import express from 'express';
import { getCategoryById, updateCategory, deleteCategory ,createCategory,getCategories} from '../controllers/category.js';
import validateId from '../middlewares/validateId.js';
import { verifyToken, verifyTokenAndAdmin } from '../middlewares/auth.js'; // Import authentication middleware
const router = express.Router();

// Route for getting a specific category by ID
router.get('/', getCategories); // Route for getting all categories
router.get('/:id', validateId, getCategoryById);

// Route for updating a category by ID
router.put('/:id', verifyToken, verifyTokenAndAdmin, validateId, updateCategory);

// Route for deleting a category by ID
router.delete('/:id', verifyToken, verifyTokenAndAdmin, validateId, deleteCategory);
router.post('/', verifyToken, verifyTokenAndAdmin, createCategory); // Ensure this route exists

export default router;
