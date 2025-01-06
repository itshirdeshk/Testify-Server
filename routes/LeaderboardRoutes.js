// Leaderboard Routes
import express from 'express';
import checkUserAuth from '../middlewares/auth-middleware.js';
import { getLeaderboardByTestId } from '../controllers/LeaderboardController.js';


const router = express.Router();


// GET /api/getLeaderboardByTestId/:testId
router.get('/leaderboard/:testId', checkUserAuth, getLeaderboardByTestId);

export default router;