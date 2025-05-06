import express from 'express';
import { registerAdmin, loginAdmin, getAdminProfile, updateAdminProfile } from '../controllers/AdminAuthController.js';
import { getUserbyId, getAllUsers, updateUser, deleteUserById } from '../controllers/UserController.js'
import {
    createExam,
    deleteExam,
    updateExam,
    getExamById,
    getAllExams,
} from '../controllers/ExamController.js';
import {
    createMockTest,
    updateMockTest,
    deleteMockTest,
    getMockTestById,
    getAllMockTests
} from '../controllers/MockTestController.js';
import checkAdminAuth from '../middlewares/checkAdminAuth.js';
import { getMockTestsByTestSeriesId } from '../controllers/MockTestController.js';
import { createTestSeries, deleteTestSeries, getAllTestSeries, getTestSeriesById, getTestSeriesBySubExamId, updateTestseries } from '../controllers/TestSeriesController.js';
import { createTest, deleteTest, getAllTest, getTestById, getTestByMockTestId, updateTest } from '../controllers/TestController.js';
import { createQuestion, deleteQuestion, getAllQuestions, getQuestionById, getQuestionsByTestId, updateQuestion } from '../controllers/QuestionController.js';
import { createSubExam, deleteSubExam, getAllSubExams, getSubExamById, getSubExamsByExamId, updateSubExam } from '../controllers/SubExamController.js';
import { createScore, deleteScore, getAllScores, getScoreById, getScoresByTestId, updateScore } from '../controllers/ScoreController.js';
import { upload } from '../middlewares/multer.js';
import { createResource, deleteResource, getAllResources, getResourceById, getResourcesBySubExamId, updateResource } from '../controllers/ResourceController.js';
import { createBanner, deleteBanner, getAllBanners, getBannerById, getBanners, updateBanner } from '../controllers/BannerController.js';
import { createFAQ, updateFAQ, getFAQById, getAllFAQs, deleteFAQ } from '../controllers/FAQController.js';
import { createTerms, updateTerms, getTermsById, getAllTerms, deleteTerms } from '../controllers/TermsController.js';
import { createPrivacyPolicy, updatePrivacyPolicy, getPrivacyPolicyById, getAllPrivacyPolicies, deletePrivacyPolicy } from '../controllers/PrivacyPolicyController.js';
import { createAboutUs, updateAboutUs, getAboutUsById, getAllAboutUs, deleteAboutUs } from '../controllers/AboutUsController.js';


const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/getUserById/:id', checkAdminAuth, getUserbyId);
router.get('/all/user', checkAdminAuth, getAllUsers);
router.put('/update/:id', checkAdminAuth, updateUser);
// router.post('/updateProfilePicture/:id', upload.single('profilePicture'), checkAdminAuth, updateUserProfilePicture);
router.delete('/delete/:id', checkAdminAuth, deleteUserById);

router.get('/me', checkAdminAuth, getAdminProfile);
router.get('/updateProfile', checkAdminAuth, updateAdminProfile);

// exams
// POST /api/exams
router.post('/add/exam', upload.single('image'), checkAdminAuth, createExam);

// PUT /api/exams/:id
router.put('/updateExamById/:id', upload.single('image'), checkAdminAuth, updateExam);

// DELETE /api/exams/:id
router.delete('/deleteExamById/:id', checkAdminAuth, deleteExam);

// GET /api/exams/:id
router.get('/getExamById/:id', checkAdminAuth, getExamById);

// GET /api/exams
router.get('/all/exams', checkAdminAuth, getAllExams);



// subExam
// POST /api/subExam
router.post('/add/subExam', upload.single('image'), checkAdminAuth, createSubExam);

// PUT /api/subExam/:id
router.put('/updateSubExamById/:id', upload.single('image'), checkAdminAuth, updateSubExam);

// DELETE /api/subExam/:id
router.delete('/deleteSubExamById/:id', checkAdminAuth, deleteSubExam);

// GET /api/subExam/:id
router.get('/getSubExamById/:id', checkAdminAuth, getSubExamById);

// GET /api/subExam
router.get('/all/subExams', checkAdminAuth, getAllSubExams);

// GET /api/subExam/:examId
router.get('/getSubExamsByExamId/:examId', checkAdminAuth, getSubExamsByExamId);



// testSeries
// POST /api/testSeries
router.post('/add/testSeries', upload.single('image'), checkAdminAuth, createTestSeries);

// PUT /api/testSeries/:id
router.put('/updateTestSeriesById/:id', upload.single('image'), checkAdminAuth, updateTestseries);

// DELETE /api/testSeries/:id
router.delete('/deleteTestSeriesById/:id', checkAdminAuth, deleteTestSeries);

// GET /api/testSeries/:id
router.get('/getTestSeriesById/:id', checkAdminAuth, getTestSeriesById);

// GET /api/getAllTestSeriess
router.get('/all/testSeries', checkAdminAuth, getAllTestSeries);

// GET /api/getTestSeriessByTestSeriesId/:id
router.get('/getTestSeriesBySubExamId/:subExamId', checkAdminAuth, getTestSeriesBySubExamId);



// mockTest
// POST /api/mockTest
router.post('/add/mockTest', checkAdminAuth, createMockTest);

// PUT /api/mockTest/:id
router.put('/updateMockTestById/:id', checkAdminAuth, updateMockTest);

// DELETE /api/mockTest/:id
router.delete('/deleteMockTestById/:id', checkAdminAuth, deleteMockTest);

// GET /api/mockTest/:id
router.get('/getMockTestById/:id', checkAdminAuth, getMockTestById);

// GET /api/getAllMockTests
router.get('/all/mockTest', checkAdminAuth, getAllMockTests);

// GET /api/getMockTestsByTestSeriesId/:id
router.get('/getMockTestsByTestSeriesId/:testSeriesId', checkAdminAuth, getMockTestsByTestSeriesId);




// Test
// POST /api/test
router.post('/add/test', checkAdminAuth, createTest);

// PUT /api/test/:id
router.put('/updateTestById/:id', checkAdminAuth, updateTest);

// DELETE /api/test/:id
router.delete('/deleteTestById/:id', checkAdminAuth, deleteTest);

// GET /api/test/:id
router.get('/getTestById/:id', checkAdminAuth, getTestById);

// GET /api/getAllTests
router.get('/all/test', checkAdminAuth, getAllTest);

// GET /api/getTestByMockTestId/:id
router.get('/getTestByMockTestId/:mockTestId', checkAdminAuth, getTestByMockTestId);



// Question
// POST /api/question
router.post('/add/question', checkAdminAuth, createQuestion);

// PUT /api/question/:id
router.put('/updateQuestionById/:id', checkAdminAuth, updateQuestion);

// DELETE /api/question/:id
router.delete('/deleteQuestionById/:id', checkAdminAuth, deleteQuestion);

// GET /api/question/:id
router.get('/getQuestionById/:id', checkAdminAuth, getQuestionById);

// GET /api/getAllQuestions
router.get('/all/question', checkAdminAuth, getAllQuestions);

// GET /api/getQuestionsByTestId/:id
router.get('/getQuestionsByTestId/:testId', checkAdminAuth, getQuestionsByTestId);



// Score
// POST /api/score
router.post('/add/score', checkAdminAuth, createScore);

// PUT /api/score/:id
router.put('/updateScoreById/:id', checkAdminAuth, updateScore);

// DELETE /api/score/:id    
router.delete('/deleteScoreById/:id', checkAdminAuth, deleteScore);

// GET /api/score/:id
router.get('/getScoreById/:id', checkAdminAuth, getScoreById);

// GET /api/getAllScores
router.get('/all/score', checkAdminAuth, getAllScores);

// GET /api/getScoresByTestId/:id
router.get('/getScoresByTestId/:testId', checkAdminAuth, getScoresByTestId);

// GET /api/getScoresByUserId/:id
// router.get('/getScoresByUserId/:userId', checkAdminAuth, getScoresByUserId);



// Resource
// POST /api/resource
router.post('/add/resource', upload.single('resource'), checkAdminAuth, createResource);

// PUT /api/resource/:id
router.put('/updateResourceById/:id', upload.single('resource'), checkAdminAuth, updateResource);

// DELETE /api/resource/:id
router.delete('/deleteResourceById/:id', checkAdminAuth, deleteResource);

// GET /api/resource/:id
router.get('/getResourceById/:id', checkAdminAuth, getResourceById);

// GET /api/getAllResources
router.get('/all/resource', checkAdminAuth, getAllResources);

// GET /api/getResourcesBySubExamId/:id
router.get('/getResourcesBySubExamId/:subExamId', checkAdminAuth, getResourcesBySubExamId);



// Banner
// POST /api/banner
router.post('/add/banner', upload.single('image'), checkAdminAuth, createBanner);

// PUT /api/banner/:id
router.put('/updateBannerById/:id', upload.single('image'), checkAdminAuth, updateBanner);

// DELETE /api/banner/:id
router.delete('/deleteBannerById/:id', checkAdminAuth, deleteBanner);

// GET /api/banner/:id
router.get('/getBannerById/:id', checkAdminAuth, getBannerById);

// GET /api/all/banners
router.get('/all/banners', checkAdminAuth, getAllBanners);

// GET /api/getBanner/:testSeriesId
router.get('/getBanners/:testSeriesId', checkAdminAuth, getBanners);

// FAQ
router.post('/add/faq', checkAdminAuth, createFAQ);
router.put('/updateFAQById/:id', checkAdminAuth, updateFAQ);
router.get('/getFAQById/:id', checkAdminAuth, getFAQById);
router.get('/all/faq', checkAdminAuth, getAllFAQs);
router.delete('/deleteFAQById/:id', checkAdminAuth, deleteFAQ);

// Terms
router.post('/add/terms', checkAdminAuth, createTerms);
router.put('/updateTermsById/:id', checkAdminAuth, updateTerms);
router.get('/getTermsById/:id', checkAdminAuth, getTermsById);
router.get('/all/terms', checkAdminAuth, getAllTerms);
router.delete('/deleteTermsById/:id', checkAdminAuth, deleteTerms);

// Privacy Policy
router.post('/add/privacy-policy', checkAdminAuth, createPrivacyPolicy);
router.put('/updatePrivacyPolicyById/:id', checkAdminAuth, updatePrivacyPolicy);
router.get('/getPrivacyPolicyById/:id', checkAdminAuth, getPrivacyPolicyById);
router.get('/all/privacy-policy', checkAdminAuth, getAllPrivacyPolicies);
router.delete('/deletePrivacyPolicyById/:id', checkAdminAuth, deletePrivacyPolicy);

// About Us
router.post('/add/about-us', checkAdminAuth, createAboutUs);
router.put('/updateAboutUsById/:id', checkAdminAuth, updateAboutUs);
router.get('/getAboutUsById/:id', checkAdminAuth, getAboutUsById);
router.get('/all/about-us', checkAdminAuth, getAllAboutUs);
router.delete('/deleteAboutUsById/:id', checkAdminAuth, deleteAboutUs);

export default router