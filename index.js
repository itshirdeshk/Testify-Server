import express from "express";
import serverless from "serverless-http"; // Add this import
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";

// Import route modules
import userRoutes from './routes/userRoutes.js';
import examRoutes from './routes/examRoutes.js';
import subcategoryExamRoutes from './routes/subcategoryexamRoutes.js';
import adminRoutes from './routes/AdminRoutes.js';
import mockTestsRoutes from './routes/mocktestsRoutes.js';
import generalRoutes from './routes/generalRoutes.js';

dotenv.config();

const app = express();
const mongodbURI = process.env.MONGOOSE_URI;

// Middleware setup
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

// Database configuration
mongoose.connect(mongodbURI)
    .then(() => console.log("MongoDB Successfully Connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// Load Routes
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/exam', examRoutes);
app.use('/api/subcategory', subcategoryExamRoutes);
app.use('/api/mocktest', mockTestsRoutes);
app.use('/api', generalRoutes);

// Root route
app.get('/', (req, res) => {
    res.status(200).json("GET request successful");
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something went wrong!' });
});

// Export for Vercel serverless
export default serverless(app);
