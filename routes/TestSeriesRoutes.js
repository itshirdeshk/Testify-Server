// Test Series Routes
import express from 'express';
import { getAllTestSeries, getTestSeriesById, getTestSeriesBySubCategoryId } from '../controllers/TestSeriesController.js';
import checkUserAuth from '../middlewares/auth-middleware.js';


const router = express.Router();

// GET /api/testSeries/:id
router.get('/:id', checkUserAuth, getTestSeriesById);

// GET /api/getAllTestSeriess
router.get('/', checkUserAuth, getAllTestSeries);

// GET /api/getTestSeriessByTestSeriesId/:id    
router.get('/testSeries/:subCategoryId', checkUserAuth, getTestSeriesBySubCategoryId);

export default router;
