// Test Routes
import express from 'express';

import { getAllTest, getTestById, getTestByMockTestId } from '../controllers/TestController.js';
import checkUserAuth from '../middlewares/auth-middleware.js';

const router = express.Router();

// GET /api/test/:id
router.get('/:id', checkUserAuth, getTestById);

// GET /api/getAllTests
router.get('/', checkUserAuth, getAllTest);

// GET /api/getTestByMockTestId/:id
router.get('/test/:mockTestId', checkUserAuth, getTestByMockTestId);

export default router;