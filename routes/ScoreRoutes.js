// Score Routes
import express from 'express';
import * as ScoreController from '../controllers/ScoreController.js';
import { verifyToken } from '../middlewares/auth-middleware.js';

const router = express.Router();

router.post('/create', verifyToken, ScoreController.createScore);
router.put('/update/:id', verifyToken, ScoreController.updateScore);
router.delete('/delete/:id', verifyToken, ScoreController.deleteScore);
router.get('/:id', verifyToken, ScoreController.getScoreById);
router.get('/test/:testId', verifyToken, ScoreController.getScoresByTestId);
router.get('/', verifyToken, ScoreController.getAllScores);

export default router;