import UserModel from '../models/UserModel.js';
import TestSeriesModel from '../models/TestSeriesModel.js';
import ExamModel from '../models/ExamModel.js';
import ResourceModel from '../models/ResourceModel.js';
import BannerModel from '../models/BannerModel.js';
import SubExamModel from '../models/SubExamModel.js';
import TestModel from '../models/TestModel.js';
import MockTestModel from '../models/MockTestModel.js';
import QuestionModel from '../models/QuestionModel.js';

// Get Dashboard
export const getDashboard = async (req, res) => {
    try {
        const dashboard = {
            Users: await UserModel.countDocuments(),
            TestSeries: await TestSeriesModel.countDocuments(),
            Exams: await ExamModel.countDocuments(),
            Resources: await ResourceModel.countDocuments(),
            Banners: await BannerModel.countDocuments(),
            SubExams: await SubExamModel.countDocuments(),
            Tests: await TestModel.countDocuments(),
            MockTests: await MockTestModel.countDocuments(),
            Questions: await QuestionModel.countDocuments(),
        };
        res.status(201).json({ message: 'Dashboard fetched successfully', dashboard });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create dashboard', error: error.message });
    }
};