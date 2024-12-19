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
import { createTestSeries, deleteTestSeries, getAllTestSeries, getTestSeriesById, getTestSeriesBySubCategoryId, updateTestseries } from '../controllers/TestSeriesController.js';
import { createTest, deleteTest, getAllTest, getTestById, getTestByMockTestId, updateTest } from '../controllers/TestController.js';
import { createQuestion, deleteQuestion, getAllQuestions, getQuestionById, getQuestionsByTestId, updateQuestion } from '../controllers/QuestionController.js';
import { createSubExam, deleteSubExam, getAllSubExams, getSubExamById, getSubExamsByExamId, updateSubExam } from '../controllers/SubExamController.js';
import { createScore, deleteScore, getAllScores, getScoreById, getScoresByTestId, updateScore } from '../controllers/ScoreController.js';
import { upload } from '../middlewares/multer.js';


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



// TestSeries
// POST /api/testSeries
router.post('/add/testSeries', checkAdminAuth, createTestSeries);

// PUT /api/testSeries/:id
router.put('/updateTestSeriesById/:id', checkAdminAuth, updateTestseries);

// DELETE /api/testSeries/:id
router.delete('/deleteTestSeriesById/:id', checkAdminAuth, deleteTestSeries);

// GET /api/testSeries/:id
router.get('/getTestSeriesById/:id', checkAdminAuth, getTestSeriesById);

// GET /api/getAllTestSeriess
router.get('/all/testSeries', checkAdminAuth, getAllTestSeries);

// GET /api/getTestSeriessByTestSeriesId/:id
router.get('/getTestSeriesBySubCategoryId/:subCategoryId', checkAdminAuth, getTestSeriesBySubCategoryId);



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

export default router