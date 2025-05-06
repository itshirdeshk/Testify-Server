import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the schema for the banner
const DashboardSchema = new Schema({
    Users: {
        type: Number,
        required: true,
    },
    TestSeries: {
        type: Number,
        required: true,
    },
    Exams: {
        type: Number,
        required: true,
    },
    Resources: {
        type: Number,
        required: true,
    },
    Banners: {
        type: Number,
        required: true,
    },
    SubExams: {
        type: Number,
        required: true,
    },
    Tests: {
        type: Number,
        required: true,
    },
    MockTests: {
        type: Number,
        required: true,
    },
    Questions: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

// Create a model using the schema
const DashboardModel = mongoose.model('Dashboard', DashboardSchema);

export default DashboardModel;