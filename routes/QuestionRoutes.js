// Question Routes
import express from 'express';
import checkUserAuth from '../middlewares/auth-middleware.js';
import { getAllQuestions, getQuestionById, getQuestionsByTestId } from '../controllers/QuestionController.js';

const router = express.Router();

// GET /api/question/:id
router.get('/:id', checkUserAuth, getQuestionById);

// GET /api/getAllQuestions
router.get('/', checkUserAuth, getAllQuestions);

// GET /api/getQuestionsByTestId/:id
router.get('/question/:testId', checkUserAuth, getQuestionsByTestId);

export default router;