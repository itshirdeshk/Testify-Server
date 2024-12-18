// Subcategory of exams routes
import express from 'express';
import {
    getSubcategoryById,
    getAllSubcategories
} from '../controllers/subCategoryExamController.js';
import checkUserAuth from '../middlewares/auth-middleware.js';

const router = express.Router();

// GET /api/subcategories/:id
router.get('/:id', checkUserAuth, getSubcategoryById);

// GET /api/subcategories
router.get('/', checkUserAuth, getAllSubcategories);
export default router;
