import QuestionModel from '../models/QuestionModel.js';
import TestModel from '../models/TestModel.js';
import mongoose from 'mongoose';

// Utility functions
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

const updateTestStats = async ({ testId, positiveMarks, session, increment = 1 }) => {
    const test = await TestModel.findById(testId).session(session);
    if (!test) throw new Error('Test not found');

    test.totalQuestions += increment;
    test.totalMarks += (positiveMarks * increment);
    await test.save({ session });
};

// Create a new Question
export const createQuestion = (req, res) => handleAsync(req, res, async () => {
    const { title, options, positiveMarks, negativeMarks, testId } = req.body;

    return handleTransaction(async (session) => {
        const [question] = await QuestionModel.create([{
            title,
            options,
            positiveMarks,
            negativeMarks,
            test: testId
        }], { session });

        await updateTestStats({
            testId,
            positiveMarks,
            session,
            increment: 1
        });

        return {
            message: 'Question created successfully',
            question,
            status: 201
        };
    });
});

// Update an existing Question
export const updateQuestion = (req, res) => handleAsync(req, res, async () => {
    return handleTransaction(async (session) => {
        const oldQuestion = await QuestionModel.findById(req.params.id).session(session);
        if (!oldQuestion) throw new Error('Question not found');

        // If positive marks are changing, update test total marks
        if ('positiveMarks' in req.body && req.body.positiveMarks !== oldQuestion.positiveMarks) {
            const test = await TestModel.findById(oldQuestion.test).session(session);
            if (!test) throw new Error('Test not found');

            test.totalMarks += (req.body.positiveMarks - oldQuestion.positiveMarks);
            await test.save({ session });
        }

        const updatedQuestion = await QuestionModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, session }
        );

        return { message: 'Question updated successfully', updatedQuestion };
    });
});

// Delete a Question
export const deleteQuestion = (req, res) => handleAsync(req, res, async () => {
    return handleTransaction(async (session) => {
        const question = await QuestionModel.findById(req.params.id).session(session);
        if (!question) throw new Error('Question not found');

        await updateTestStats({
            testId: question.test,
            positiveMarks: question.positiveMarks,
            session,
            increment: -1
        });

        await QuestionModel.findByIdAndDelete(req.params.id).session(session);
        return { message: 'Question deleted successfully' };
    });
});

// Keep other functions as they are
export const getQuestionById = (req, res) => handleAsync(req, res, async () => {
    let query = QuestionModel.findById(req.params.id);
    if (req.admin) {
        query = query.populate('test');
    }
    const question = await query;
    if (!question) throw new Error('Question not found');
    return { message: 'Question found successfully', question };
});

export const getAllQuestions = (req, res) => handleAsync(req, res, async () => {
    let query = QuestionModel.find();
    if (req.admin) {
        query = query.populate('test');
    }
    const questions = await query;
    return { message: 'Questions found successfully', questions };
});

export const getQuestionsByTestId = (req, res) => handleAsync(req, res, async () => {
    const questions = await QuestionModel.find({ test: req.params.testId });
    if (!questions) throw new Error('Questions not found');
    return { message: 'Questions found successfully', questions };
});