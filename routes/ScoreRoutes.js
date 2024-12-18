// Score Routes
import express from 'express';
import checkUserAuth from '../middlewares/auth-middleware.js';
import { getAllScores, getScoreById, getScoresByTestId } from '../controllers/ScoreController.js';

const router = express.Router();

// GET /api/score/:id
router.get('/:id', checkUserAuth, getScoreById);

// GET /api/getAllScores
router.get('/', checkUserAuth, getAllScores);

// GET /api/getScoresByTestId/:id
router.get('/score/:testId', checkUserAuth, getScoresByTestId);

export default router;