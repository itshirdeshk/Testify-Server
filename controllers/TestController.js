import TestModel from '../models/TestModel.js';
import MockTestModel from '../models/MockTestModel.js';
import TestSeriesModel from '../models/TestSeriesModel.js';
import ScoreModel from '../models/ScoreModel.js';
import mongoose from 'mongoose';

// Refactor helper functions at the top
const updateTestCounts = async ({ mockTest, testSeries, isFree, session, increment = 1 }) => {
    if (isFree) {
        mockTest.freeTests += increment;
        testSeries.freeTests += increment;
    }
    await Promise.all([
        mockTest.save({ session }),
        testSeries.save({ session })
    ]);
};

const getTestRelations = async (mockTestId, session) => {
    const mockTest = await MockTestModel.findById(mockTestId).session(session);
    if (!mockTest) throw new Error('MockTest not found');

    const testSeries = await TestSeriesModel.findById(mockTest.testSeries).session(session);
    if (!testSeries) throw new Error('TestSeries not found');

    return { mockTest, testSeries };
};

// Add these utility functions at the top
const handleAsync = async (req, res, operation) => {
    try {
        const result = await operation();
        res.status(result.status || 200).json(result);
    } catch (error) {
        res.status(500).json({
            message: error.message || 'Operation failed',
            error: error.message
        });
    }
};

const handleTransaction = async (operation) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const result = await operation(session);
        await session.commitTransaction();
        return result;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

// Test Controller

// Create a new Test
export const createTest = (req, res) => handleAsync(req, res, async () => {
    const { title, totalQuestions, duration, totalMarks, mockTestId, isFree } = req.body;

    return handleTransaction(async (session) => {
        const [test] = await TestModel.create([{
            title, totalQuestions, duration, totalMarks, mockTest: mockTestId, isFree
        }], { session });

        const { mockTest, testSeries } = await getTestRelations(mockTestId, session);
        mockTest.totalTests += 1;
        testSeries.totalTests += 1;
        await updateTestCounts({ mockTest, testSeries, isFree, session, increment: 1 });

        return { message: 'Test created successfully', test, status: 201 };
    });
});

const handleFreeStatusChange = async ({ oldTest, updatedData, session }) => {
    if (!('isFree' in updatedData) || updatedData.isFree === oldTest.isFree) {
        return;
    }

    const { mockTest, testSeries } = await getTestRelations(oldTest.mockTest, session);
    const increment = updatedData.isFree ? 1 : -1;
    await updateTestCounts({ mockTest, testSeries, isFree: true, session, increment });
};

// Update an existing Test
export const updateTest = (req, res) => handleAsync(req, res, async () => {
    return handleTransaction(async (session) => {
        const oldTest = await TestModel.findById(req.params.id).session(session);
        if (!oldTest) throw new Error('Test not found');

        await handleFreeStatusChange({ oldTest, updatedData: req.body, session });
        const updatedTest = await TestModel.findByIdAndUpdate(
            req.params.id, req.body, { new: true, session }
        );

        return { message: 'Test updated successfully', updatedTest };
    });
});

// Delete a Test
export const deleteTest = (req, res) => handleAsync(req, res, async () => {
    return handleTransaction(async (session) => {
        const test = await TestModel.findById(req.params.id).session(session);
        if (!test) throw new Error('Test not found');

        const { mockTest, testSeries } = await getTestRelations(test.mockTest, session);
        mockTest.totalTests -= 1;
        testSeries.totalTests -= 1;
        await updateTestCounts({ mockTest, testSeries, isFree: test.isFree, session, increment: -1 });
        await TestModel.findByIdAndDelete(req.params.id).session(session);

        return { message: 'Test deleted successfully' };
    });
});

// Get a Test by ID
export const getTestById = (req, res) => handleAsync(req, res, async () => {
    const test = await TestModel.findById(req.params.id);
    if (!test) throw new Error('Test not found');
    return { message: 'Test found successfully', test };
});

// Get all Test
export const getAllTests = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { title } = req.query;

    try {
        // Build filter object based on provided query parameters
        const filter = {};
        if (title) {
            filter.title = { $regex: title, $options: 'i' };
        }

        const totalDocs = await TestModel.countDocuments(filter);
        const totalPages = Math.ceil(totalDocs / limit);

        let query = TestModel.find(filter)
            .skip(skip)
            .limit(limit);

        if (req.admin) {
            query = query.populate('mockTest');
        }

        const tests = await query;

        res.status(200).json({
            tests,
            pagination: {
                currentPage: page,
                totalPages,
                totalDocs,
                hasPrevPage: page > 1,
                hasNextPage: page < totalPages
            }
        });
    } catch (error) {
        console.error('Error fetching tests:', error);
        res.status(500).json({ message: 'Failed to get tests', error: error.message });
    }
};

// Get Test by MockTest ID
export const getTestByMockTestId = (req, res) => handleAsync(req, res, async () => {
    const user = req.user;
    if (!user) {
        throw new Error('User not found');
    }

    const attemptedTests = (await ScoreModel.find({ user: user._id }).populate('test')).filter(score => score.test.mockTest == req.params.mockTestId);

    const unattemptedTests = await TestModel.find({
        $and: [
            { mockTest: req.params.mockTestId },
            { _id: { $nin: attemptedTests.map(score => score.test._id) } }
        ]
    });
    if (!attemptedTests && !unattemptedTests) throw new Error('Tests not found');

    return { message: 'Tests found successfully', attemptedTests, unattemptedTests };
});