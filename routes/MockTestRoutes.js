// Mock Tests Routes
import express from 'express';
import { getAllMockTests, getMockTestById, getMockTestsByTestSeriesId } from '../controllers/MockTestController.js';
import checkUserAuth from '../middlewares/auth-middleware.js';


const router = express.Router();

// GET /api/mockTest/:id
router.get('/:id', checkUserAuth, getMockTestById);

// GET /api/getAllMockTests
router.get('/', checkUserAuth, getAllMockTests);

// GET /api/getMockTestsByTestSeriesId/:id
router.get('/mockTest/:testSeriesId', checkUserAuth, getMockTestsByTestSeriesId);

export default router;
