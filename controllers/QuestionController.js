import PdfParse from 'pdf-parse';
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
    test.totalMarks += (test.positiveMarks * increment);
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

export const getAllQuestions = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { title, testId } = req.query;

    try {
        // Build filter object based on provided query parameters
        const filter = {};
        if (title) {
            filter.title = { $regex: title, $options: 'i' };
        }
        if (testId) {
            filter.test = testId;
        }

        const totalDocs = await QuestionModel.countDocuments(filter);
        const totalPages = Math.ceil(totalDocs / limit);

        let query = QuestionModel.find(filter)
            .skip(skip)
            .limit(limit);

        if (req.admin) {
            query = query.populate('test');
        }

        const questions = await query;

        res.status(200).json({
            questions,
            pagination: {
                currentPage: page,
                totalPages,
                totalDocs,
                hasPrevPage: page > 1,
                hasNextPage: page < totalPages
            }
        });
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ message: 'Failed to get questions', error: error.message });
    }
};

export const getQuestionsByTestId = (req, res) => handleAsync(req, res, async () => {
    const questions = await QuestionModel.find({ test: req.params.testId });
    if (!questions) throw new Error('Questions not found');
    return { message: 'Questions found successfully', questions };
});

export const createBulkQuestions = (req, res) =>
    handleAsync(req, res, async () => {
        const { testId, positiveMarks, negativeMarks } = req.body;
        const pdfBuffer = req.file.buffer; try {
            const pdfData = await PdfParse(pdfBuffer);
            const rawText = pdfData.text;

            const cleanedText = rawText.replace(/\r?\n|\r/g, '').trim();
            let questions;
            try {
                questions = JSON.parse(cleanedText);
                console.log(questions);

            } catch (jsonErr) {
                return res.status(400).json({
                    error: 'Invalid JSON structure in PDF',
                    raw: cleanedText
                });
            }

            if (!Array.isArray(questions) || questions.length === 0) {
                throw new Error('Invalid questions array');
            }

            return handleTransaction(async (session) => {
                const createdQuestions = await QuestionModel.insertMany(
                    questions.map((q) => ({
                        title: q.question,
                        options: q.options,
                        test: testId,
                        positiveMarks,
                        negativeMarks
                    })),
                    { session }
                );

                const totalMarks = createdQuestions.length * (positiveMarks);

                await updateTestStats({
                    testId,
                    positiveMarks,
                    session,
                    increment: createdQuestions.length
                });

                return {
                    message: 'Bulk questions created successfully',
                    questions: createdQuestions,
                    status: 201
                };
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({
                message: 'Bulk Error',
                error: error.message
            });
        }
    });

// Bulk Delete Questions
export const deleteBulkQuestions = (req, res) => handleAsync(req, res, async () => {
    const { questionIds } = req.body;

    if (!questionIds || !Array.isArray(questionIds) || questionIds.length === 0) {
        throw new Error('Invalid question IDs array');
    }

    return handleTransaction(async (session) => {
        // Fetch all questions to be deleted
        const questions = await QuestionModel.find({
            _id: { $in: questionIds }
        }).session(session);

        if (questions.length === 0) {
            throw new Error('No questions found to delete');
        }

        // Group questions by testId and calculate stats
        const testUpdates = {};
        questions.forEach((question) => {
            const testId = question.test.toString();
            if (!testUpdates[testId]) {
                testUpdates[testId] = {
                    count: 0,
                    totalMarks: 0
                };
            }
            testUpdates[testId].count += 1;
            testUpdates[testId].totalMarks += question.positiveMarks;
        });

        // Update each test's stats
        for (const [testId, stats] of Object.entries(testUpdates)) {
            const test = await TestModel.findById(testId).session(session);
            if (test) {
                test.totalQuestions -= stats.count;
                test.totalMarks -= stats.totalMarks;
                await test.save({ session });
            }
        }

        // Delete all questions
        await QuestionModel.deleteMany({
            _id: { $in: questionIds }
        }).session(session);

        return {
            message: `Successfully deleted ${questions.length} questions`,
            deletedCount: questions.length
        };
    });
});