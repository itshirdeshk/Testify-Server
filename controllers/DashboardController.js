import DashboardModel from '../models/DashboardModel.js';
import UserModel from '../models/UserModel.js';
import TestSeriesModel from '../models/TestSeriesModel.js';
import ExamModel from '../models/ExamModel.js';
import ResourceModel from '../models/ResourceModel.js';
import BannerModel from '../models/BannerModel.js';
import SubExamModel from '../models/SubExamModel.js';
import TestModel from '../models/TestModel.js';
import MockTestModel from '../models/MockTestModel.js';
import QuestionModel from '../models/QuestionModel.js';

// Create Dashboard
export const createDashboard = async (req, res) => {
    try {
        // Check if a dashboard already exists
        const existing = await DashboardModel.findOne();
        if (existing) {
            return res.status(400).json({ message: 'Dashboard already exists' });
        }
        const counts = {
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
        const dashboard = new DashboardModel(counts);
        await dashboard.save();
        res.status(201).json({ message: 'Dashboard created successfully', dashboard });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create dashboard', error: error.message });
    }
};

// Update Dashboard (fetch latest counts and update fields)
export const updateDashboard = async (req, res) => {
    try {
        const counts = {
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
        // Update the first (or only) dashboard document
        const dashboard = await DashboardModel.findOneAndUpdate({}, counts, { new: true });
        res.status(200).json({ message: 'Dashboard updated successfully', dashboard });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update dashboard', error: error.message });
    }
};

// Get Dashboard
export const getDashboard = async (req, res) => {
    try {
        const dashboard = await DashboardModel.findOne();
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard not found' });
        }
        res.status(200).json({ message: 'Dashboard fetched successfully', dashboard });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get dashboard', error: error.message });
    }
}; 