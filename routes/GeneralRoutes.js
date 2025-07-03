import express from 'express';
import { getAllTerms } from '../controllers/TermsController.js';
import { getAllFAQs } from '../controllers/FAQController.js';
import { getAllPrivacyPolicies } from '../controllers/PrivacyPolicyController.js';
import { getAllAboutUs } from '../controllers/AboutUsController.js';

const router = express.Router();

router.get('/all/faq', getAllFAQs);
router.get('/all/terms', getAllTerms);
router.get('/all/privacy-policy', getAllPrivacyPolicies);
router.get('/all/about-us', getAllAboutUs);

export default router;
