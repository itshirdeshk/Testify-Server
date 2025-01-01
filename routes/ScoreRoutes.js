// Score Routes
import express from 'express';
import checkUserAuth from '../middlewares/auth-middleware.js';
import { createScore, getAllScores, getScoreById, getScoresByTestId, updateScore } from '../controllers/ScoreController.js';


const router = express.Router();

router.post('/create', checkUserAuth, createScore);
router.put('/update/:testId', checkUserAuth, updateScore);
router.get('/:id', checkUserAuth, getScoreById);
router.get('/test/:testId', checkUserAuth, getScoresByTestId);
router.get('/', checkUserAuth, getAllScores);

export default router;