// Subcategory of exams routes
import express from 'express';
import {
    getSubExamById,
    getAllSubExams,
    getSubExamsByExamId
} from '../controllers/SubExamController.js';
import checkUserAuth from '../middlewares/auth-middleware.js';

const router = express.Router();

// GET /api/subcategories/:id
router.get('/:id', checkUserAuth, getSubExamById);

// GET /api/subcategories
router.get('/', checkUserAuth, getAllSubExams);

// GET /api/subcategories
router.get('/subExam/:examId', checkUserAuth, getSubExamsByExamId);

export default router;
