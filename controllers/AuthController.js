import UserModel from '../models/UserModel.js';
import ExamModel from '../models/ExamModel.js';
import SubExamModel from '../models/SubExamModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import transporter from '../config/emailConfig.js'
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import cloudinary from '../cloudinaryConfig/cloudinaryConfig.js';

// Helper Functions
const checkUserExists = async (email, phone) => {
    const existingUser = await UserModel.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
        if (existingUser.email === email) {
            throw new Error("Email address is already registered");
        }
        throw new Error("Phone number is already registered");
    }
};

const validatePasswords = (password, password_confirmation) => {
    if (!password || !password_confirmation) {
        throw new Error("Both password and confirmation password are required");
    }
    if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
    }
    if (password !== password_confirmation) {
        throw new Error("Password and confirmation password do not match");
    }
};

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
    }
};

const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
        throw new Error("Phone number must be 10 digits");
    }
};

const generateAndSendOTP = async (email) => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const html = await compileEmailTemplate(otp, "Email Verification");
    transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `${ otp } is your OTP for email verification on EdTech`,
        html: html
    });
    return otp;
};

const compileEmailTemplate = async (otp, purpose) => {
    const sourcePath = path.join(process.cwd(), 'EmailTemplate', 'Emailtemplate.html');
    if (!fs.existsSync(sourcePath)) {
        throw new Error(`HTML email template file not found at: ${sourcePath}`);
    }
    const source = fs.readFileSync(sourcePath, 'utf8');
    const template = handlebars.compile(source);
    return template({ otp, purpose });
};

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const registerUser = async (req, res) => {
    const { name, email, phone, password, password_confirmation } = req.body;

    try {
        // Validate required fields
        if (!name || !email || !phone || !password || !password_confirmation) {
            return res.status(400).json({
                status: "failed",
                message: "All fields are required (name, email, phone, password, password confirmation)"
            });
        }

        // Validate name
        if (name.length < 2) {
            return res.status(400).json({
                status: "failed",
                message: "Name must be at least 2 characters long"
            });
        }

        // Validate email and phone
        validateEmail(email);
        validatePhone(phone);

        // Check if user exists and validate passwords
        await checkUserExists(email, phone);
        validatePasswords(password, password_confirmation);

        const otp = await generateAndSendOTP(email);
        const hashedPassword = await hashPassword(password);

        const newUser = new UserModel({
            name,
            email,
            phone,
            password: hashedPassword,
            otp,
            otpCreatedAt: new Date()
        });
        await newUser.save();

        const token = generateAccessToken(newUser._id);

        res.status(201).json({
            status: "success",
            message: "Registration successful. OTP sent to your email for verification",
            newUser,
            token
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(400).json({
            status: "failed",
            message: error.message || "Unable to register user"
        });
    }
};

export const loginUser = async (req, res) => {
    const { phone, password } = req.body;

    try {
        if (!phone || !password) {
            return res.status(400).json({
                status: "failed",
                message: "Both phone number and password are required"
            });
        }

        validatePhone(phone);

        const user = await UserModel.findOne({ phone })
            .populate('exam', { name: 1 })
            .populate('subExam', { name: 1 });

        if (!user) {
            return res.status(404).json({
                status: "failed",
                message: "No account found with this phone number"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                status: "failed",
                message: "Incorrect password"
            });
        }

        if (!user.isUserVerified) {
            return res.status(403).json({
                status: "failed",
                message: "Please verify your email before logging in"
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        user.otp = otp;
        user.otpCreatedAt = new Date();
        await user.save();

        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: "EdTech - Login Verification OTP",
            html: `<h1>Your login verification OTP is: ${otp}</h1><p>This OTP will expire in 15 minutes.</p>`
        });

        const token = generateAccessToken(user._id);

        res.status(200).json({
            status: "success",
            message: "Login successful. Please verify with the OTP sent to your email",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                exam: user.exam,
                subExam: user.subExam,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(400).json({
            status: "failed",
            message: error.message || "Unable to login"
        });
    }
};

export const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        if (!email || !otp) {
            return res.status(400).json({
                status: "failed",
                message: "Email and OTP are required"
            });
        }

        validateEmail(email);

        if (!/^\d{6}$/.test(otp)) {
            return res.status(400).json({
                status: "failed",
                message: "OTP must be 6 digits"
            });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                status: "failed",
                message: "No account found with this email address"
            });
        }

        if (user.otp !== parseInt(otp)) {
            return res.status(400).json({
                status: "failed",
                message: "Invalid OTP"
            });
        }

        const currentTime = new Date();
        const otpExpiration = new Date(user.otpCreatedAt);
        otpExpiration.setMinutes(otpExpiration.getMinutes() + 15);

        if (currentTime > otpExpiration) {
            return res.status(400).json({
                status: "failed",
                message: "OTP has expired. Please request a new OTP"
            });
        }

        const sourcePath = path.join(process.cwd(), 'EmailTemplate', 'Verifyotptemplate.html');
        if (!fs.existsSync(sourcePath)) {
            throw new Error("Email template not found");
        }

        const source = fs.readFileSync(sourcePath, 'utf8');
        const template = handlebars.compile(source);
        const html = template({ name: user.name });

        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: "EdTech - Email Verification Successful",
            html: html
        });

        user.isUserVerified = true;
        user.otp = otp;
        await user.save();

        res.status(200).json({
            status: "success",
            message: "Email verified successfully"
        });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(400).json({
            status: "failed",
            message: error.message || "Unable to verify OTP"
        });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, newPassword_confirmation } = req.body;
        const userId = req.user._id;

        // Validate required fields
        if (!oldPassword || !newPassword || !newPassword_confirmation) {
            return res.status(400).json({
                status: 'failed',
                message: 'All fields (old password, new password, and confirmation) are required'
            });
        }

        // Find user
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: 'failed',
                message: 'User account not found'
            });
        }

        // Validate old password
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                status: 'failed',
                message: 'Current password is incorrect'
            });
        }

        // Validate new password
        if (newPassword.length < 8) {
            return res.status(400).json({
                status: 'failed',
                message: 'New password must be at least 8 characters long'
            });
        }

        if (newPassword !== newPassword_confirmation) {
            return res.status(400).json({
                status: 'failed',
                message: 'New password and confirmation do not match'
            });
        }

        if (oldPassword === newPassword) {
            return res.status(400).json({
                status: 'failed',
                message: 'New password must be different from current password'
            });
        }

        // Hash and save new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();

        // Send password change notification email
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: 'EdTech - Password Changed Successfully',
            html: '<h1>Your password has been changed successfully</h1><p>If you did not make this change, please contact support immediately.</p>'
        });

        res.status(200).json({
            status: 'success',
            message: 'Password updated successfully'
        });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({
            status: 'failed',
            message: error.message || 'Unable to change password'
        });
    }
};

export const sendUserPasswordResetEmail = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) {
            return res.status(400).json({
                status: 'failed',
                message: 'Email address is required'
            });
        }

        validateEmail(email);

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                status: 'failed',
                message: 'No account found with this email address'
            });
        }

        const sourcePath = path.join(process.cwd(), 'EmailTemplate', 'Emailtemplate.html');
        if (!fs.existsSync(sourcePath)) {
            throw new Error('Email template not found');
        }

        const source = fs.readFileSync(sourcePath, 'utf8');
        const template = handlebars.compile(source);
        const otp = Math.floor(100000 + Math.random() * 900000);
        const purpose = 'Reset Password';
        const html = template({ otp, purpose });

        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: `${otp} is your OTP for password reset on EdTech`,
            html: html
        });

        user.otp = otp;
        user.otpCreatedAt = new Date();
        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'Password reset OTP sent to your email address'
        });
    } catch (error) {
        console.error('Error sending password reset email:', error);
        res.status(400).json({
            status: 'failed',
            message: error.message || 'Failed to send password reset email'
        });
    }
};

export const userPasswordReset = async (req, res) => {
    const { email, otp, password, password_confirmation } = req.body;

    try {
        // Validate required fields
        if (!email || !otp || !password || !password_confirmation) {
            return res.status(400).json({
                status: 'failed',
                message: 'All fields (email, OTP, password, and confirmation) are required'
            });
        }

        validateEmail(email);

        // Validate OTP format
        if (!/^\d{6}$/.test(otp)) {
            return res.status(400).json({
                status: 'failed',
                message: 'OTP must be 6 digits'
            });
        }

        const user = await UserModel.findOne({ email, otp: parseInt(otp) });
        if (!user) {
            return res.status(400).json({
                status: 'failed',
                message: 'Invalid email or OTP'
            });
        }

        // Check OTP expiration
        const currentTime = new Date();
        const otpExpiration = new Date(user.otpCreatedAt);
        otpExpiration.setMinutes(otpExpiration.getMinutes() + 15);

        if (currentTime > otpExpiration) {
            return res.status(400).json({
                status: 'failed',
                message: 'OTP has expired. Please request a new OTP'
            });
        }

        // Validate new password
        if (password.length < 8) {
            return res.status(400).json({
                status: 'failed',
                message: 'Password must be at least 8 characters long'
            });
        }

        if (password !== password_confirmation) {
            return res.status(400).json({
                status: 'failed',
                message: 'Password and confirmation do not match'
            });
        }

        // Hash and save new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
        user.otp = undefined;
        await user.save();

        // Send confirmation email
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'EdTech - Password Reset Successful',
            html: '<h1>Your password has been reset successfully</h1><p>If you did not make this change, please contact support immediately.</p>'
        });

        res.status(200).json({
            status: 'success',
            message: 'Password reset successfully'
        });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(400).json({
            status: 'failed',
            message: error.message || 'Unable to reset password'
        });
    }
};

export const ProfileUser = async (req, res) => {
    res.send({ "user": req.user })
}

export const updateLoggedInUserProfile = async (req, res) => {
    const { name, email, phone, examId, subExamId } = req.body;
    const userId = req.user._id;
    const image = req.file?.buffer;

    try {
        // Validate inputs
        if (name && name.length < 2) {
            return res.status(400).json({
                status: 'failed',
                message: 'Name must be at least 2 characters long'
            });
        }

        if (email) {
            validateEmail(email);
            // Check if email is already used by another user
            const existingUser = await UserModel.findOne({ email, _id: { $ne: userId } });
            if (existingUser) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Email address is already in use'
                });
            }
        }

        if (phone) {
            validatePhone(phone);
            // Check if phone is already used by another user
            const existingUser = await UserModel.findOne({ phone, _id: { $ne: userId } });
            if (existingUser) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Phone number is already in use'
                });
            }
        }

        // Validate exam and subExam if provided
        if (examId) {
            const exam = await ExamModel.findById(examId);
            if (!exam) {
                return res.status(404).json({
                    status: 'failed',
                    message: 'Selected exam not found'
                });
            }
        }

        if (subExamId) {
            const subExam = await SubExamModel.findById(subExamId);
            if (!subExam) {
                return res.status(404).json({
                    status: 'failed',
                    message: 'Selected sub-exam not found'
                });
            }
        }

        let user = await findUserById(userId);
        if (!user) {
            return res.status(404).json({
                status: 'failed',
                message: 'User not found'
            });
        }

        // Handle image upload
        if (image) {
            if (image.size > 5 * 1024 * 1024) { // 5MB limit
                return res.status(400).json({
                    status: 'failed',
                    message: 'Profile picture must be less than 5MB'
                });
            }

            const stream = cloudinary.v2.uploader.upload_stream({
                folder: 'user_profile_pictures',
                public_id: userId,
                overwrite: true
            }, async (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    return res.status(500).json({
                        status: 'failed',
                        message: 'Failed to upload profile picture'
                    });
                }

                try {
                    user = await updateUserAndReturnResponse(user, {
                        name,
                        email,
                        phone,
                        examId,
                        subExamId,
                        profilePicture: result.secure_url
                    }, res);
                } catch (error) {
                    return res.status(500).json({
                        status: 'failed',
                        message: error.message || 'Failed to update profile'
                    });
                }
            });

            stream.end(image);
        } else {
            try {
                user = await updateUserAndReturnResponse(user, {
                    name,
                    email,
                    phone,
                    examId,
                    subExamId
                }, res);
            } catch (error) {
                return res.status(500).json({
                    status: 'failed',
                    message: error.message || 'Failed to update profile'
                });
            }
        }
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(400).json({
            status: 'failed',
            message: error.message || 'Unable to update user profile'
        });
    }
};

const updateUserAndReturnResponse = async (user, updates, res) => {
    updateUserFields(user, updates);
    await user.save();

    const updatedUser = await UserModel.findById(user._id)
        .populate('exam', { name: 1 })
        .populate('subExam', { name: 1 });

    const userObj = updatedUser.toObject();
    userObj.examName = updatedUser.exam?.name;
    userObj.subExamName = updatedUser.subExam?.name;
    userObj.exam = updatedUser.exam?._id;
    userObj.subExam = updatedUser.subExam?._id;

    return res.status(200).json({
        status: 'success',
        message: 'Profile updated successfully',
        user: userObj
    });
};

const updateUserFields = (user, updates) => {
    if (updates.name) user.name = updates.name;
    if (updates.email) user.email = updates.email;
    if (updates.phone) user.phone = updates.phone;
    if (updates.profilePicture) user.profilePicture = updates.profilePicture;
    if (updates.examId) user.exam = updates.examId;
    if (updates.subExamId) user.subExam = updates.subExamId;
};