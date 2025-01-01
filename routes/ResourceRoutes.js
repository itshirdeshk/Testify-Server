import express from 'express';
import checkUserAuth from '../middlewares/auth-middleware.js';
import { getAllResources, getResourceById, getResourcesBySubExamId } from '../controllers/ResourceController.js';


const router = express.Router();


// GET /api/resource/:id
router.get('/:id',checkUserAuth, getResourceById);

// GET /api/resource
router.get('/',checkUserAuth, getAllResources);

// GET /api/resource/resource/:subExamId
router.get('/resource/:subExamId',checkUserAuth, getResourcesBySubExamId);

export default router;
