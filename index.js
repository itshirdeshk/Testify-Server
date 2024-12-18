import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";

// Import route modules
import userRoutes from './routes/UserRoutes.js';
import examRoutes from './routes/ExamRoutes.js';
import subcategoryExamRoutes from './routes/SubCategoryExamRoutes.js';
import adminRoutes from './routes/AdminRoutes.js';
import mockTestsRoutes from './routes/MockTestRoutes.js';
import generalRoutes from './routes/GeneralRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080; // Use PORT in uppercase for environment variables
const mongodbURI = process.env.MONGOOSE_URI;

// Middleware setup
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev')); // Log HTTP requests for better debugging

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
    if (res.headersSent) {
        return next(err);
    }
    console.error(err.stack); // Log the error stack for debugging
    res.status(500).send({ message: 'Something went wrong!' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});