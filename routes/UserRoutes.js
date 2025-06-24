import express from 'express';
import { registerUser, verifyOTP, loginUser, changePassword, ProfileUser, sendOtpAgain, sendUserPasswordResetEmail, userPasswordReset, updateLoggedInUserProfile } from '../controllers/AuthController.js';
import checkUserAuth from '../middlewares/auth-middleware.js';
import { upload } from '../middlewares/multer.js';
import { makeUserNormal, makeUserPremium } from '../controllers/UserController.js';

const router = express.Router();

// Public Routes
router.post('/register', registerUser)
router.post('/verify/otp', verifyOTP)
router.post('/login', loginUser)
router.post('/send-reset-password-email', sendUserPasswordResetEmail)
router.post('/reset-password', userPasswordReset)
router.post('/send-otp-again', sendOtpAgain);

// Protected Routes
router.get('/me', checkUserAuth, ProfileUser)
router.post('/changePassword', checkUserAuth, changePassword)
router.put('/updateProfile', upload.single('image'), checkUserAuth, updateLoggedInUserProfile)

export default router;