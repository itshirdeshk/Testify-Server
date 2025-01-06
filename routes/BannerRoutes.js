import express from 'express';
import checkUserAuth from '../middlewares/auth-middleware.js';
import { getAllBanners, getBannerById, getBanners } from '../controllers/BannerController.js';


const router = express.Router();


// GET /api/banners/:id
router.get('/:id', checkUserAuth, getBannerById);

// GET /api/banners
router.get('/', checkUserAuth, getAllBanners);

// GET /api/banners/:testSeriesId
router.get('/banner/:testSeriesId', checkUserAuth, getBanners);

export default router;