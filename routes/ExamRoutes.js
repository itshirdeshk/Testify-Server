import express from 'express';
import {
    getExamById,
    getAllExams,
} from '../controllers/ExamController.js';
import checkUserAuth from '../middlewares/auth-middleware.js';


const router = express.Router();


// GET /api/exams/:id
router.get('/:id',checkUserAuth, getExamById);

// GET /api/exams
router.get('/',checkUserAuth, getAllExams);

export default router;
