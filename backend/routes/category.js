import express from 'express';
import { getCategoryById, updateCategory, deleteCategory ,createCategory,getCategories} from '../controllers/category.js';
import validateId from '../middlewares/validateId.js';
import { verifyToken, verifyTokenAndAdmin } from '../middlewares/auth.js'; // Import authentication middleware
const router = express.Router();

router.get('/', getCategories); 
router.get('/:id', validateId, getCategoryById);
router.put('/:id', verifyToken, verifyTokenAndAdmin, validateId, updateCategory);
router.delete('/:id', verifyToken, verifyTokenAndAdmin, validateId, deleteCategory);
router.post('/', verifyToken, verifyTokenAndAdmin, createCategory); // Ensure this route exists

export default router;
