// Subcategory of exams routes
import express from 'express';
import {
    getSubcategoryById,
    getAllSubcategories,
    getSubcategoriesByExamId
} from '../controllers/SubExamController.js';
import checkUserAuth from '../middlewares/auth-middleware.js';

const router = express.Router();

// GET /api/subcategories/:id
router.get('/:id', checkUserAuth, getSubcategoryById);

// GET /api/subcategories
router.get('/', checkUserAuth, getAllSubcategories);

// GET /api/subcategories
router.get('/subExam/:examId', checkUserAuth, getSubcategoriesByExamId);

export default router;
