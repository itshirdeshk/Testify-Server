import mongoose from 'mongoose';
import LeaderboardModel from '../models/LeaderboardModel.js';
import ScoreModel from '../models/ScoreModel.js';
import TestModel from '../models/TestModel.js';

const calculateScoreStats = async (totalCorrect, totalIncorrect, totalQuestionsAttempted, testId) => {
    // Get test details first
    const test = await TestModel.findById(testId);
    if (!test) throw new Error('Test not found');

    // Calculate marks
    const totalMarksObtained = (totalCorrect * test.positiveMarks) - (totalIncorrect * test.negativeMarks);
    const maxPossibleMarks = test.totalQuestions * test.positiveMarks;

    // Calculate basic stats
    const accuracy = totalQuestionsAttempted > 0
        ? ((totalCorrect / totalQuestionsAttempted) * 100).toFixed(2)
        : 0;

    const percentage = (maxPossibleMarks > 0 && totalMarksObtained > 0)
        ? ((totalMarksObtained / maxPossibleMarks) * 100).toFixed(2)
        : 0;

    // Get all scores for this test to calculate rank and percentile
    const allScores = await ScoreModel.find({ test: testId });

    const totalParticipants = allScores.length + 1; // Including current score

    // Calculate average score
    const averageScore = allScores.length > 0
        ? (allScores.reduce((sum, score) => sum + score.totalMarksObtained, 0) / allScores.length).toFixed(2)
        : totalMarksObtained;

    // Calculate best score
    const bestScore = allScores.length > 0
        ? Math.max(parseFloat(totalMarksObtained), ...allScores.map(score => score.totalMarksObtained))
        : totalMarksObtained;

    // Calculate rank and percentile
    const sortedScores = [...allScores.map(s => s.percentage), parseFloat(percentage)]
        .sort((a, b) => b - a);

    const rank = sortedScores.indexOf(parseFloat(percentage)) + 1;
    const percentile = ((totalParticipants - rank + 1) / totalParticipants * 100).toFixed(2);

    return {
        accuracy: parseFloat(accuracy),
        percentage: parseFloat(percentage),
        percentile: parseFloat(percentile),
        rank,
        totalMarksObtained,
        totalMarks: maxPossibleMarks,
        testStats: {
            totalParticipants,
            averageScore: parseFloat(averageScore),
            bestScore: parseFloat(bestScore)
        }
    };
};

// Modified handleAsync to work with Express middleware
const handleAsync = (handler) => {
    return async (req, res, next) => {
        try {
            const result = await handler(req);
            const { status = 200, message, data } = result;
            res.status(status).json({ message, ...(data && { score: data }) });
        } catch (error) {
            next(error);
        }
    };
};

const checkAuth = (req) => {
    if (!req.user && !req.admin) throw new Error('Unauthorized Access');
};

// Export middleware functions directly
export const createScore = handleAsync(async (req) => {
    checkAuth(req);
    const { totalQuestionsAttempted, totalCorrect, totalIncorrect, testId, timeTaken } = req.body;

    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const stats = await calculateScoreStats(totalCorrect, totalIncorrect, totalQuestionsAttempted, testId);

        // Create score within the transaction
        const score = await ScoreModel.create([{
            totalQuestionsAttempted,
            totalCorrect,
            totalIncorrect,
            timeTaken,
            test: testId,
            user: req.user !== undefined ? req.user._id : req.admin._id,
            ...stats,
        }], { session }); // Use the session

        // Create leaderboard within the transaction
        await LeaderboardModel.create([{
            user: req.user !== undefined ? req.user._id : req.admin._id,
            test: testId,
            score: score[0]._id, // Access the created score (since `create` with an array returns an array)
            rank: stats.rank,
        }], { session }); // Use the session

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        return { status: 201, message: 'Score created successfully', data: score[0] };
    } catch (error) {
        // Abort the transaction in case of error
        await session.abortTransaction();
        session.endSession();
        throw error; // Rethrow the error to be handled by the global error handler
    }
});

// Update other handlers similarly
export const updateScore = handleAsync(async (req) => {
    const { testId } = req.params;

    // Find the score associated with the user and test
    const score = await ScoreModel.findOne({
        test: testId,
        user: req.user !== undefined ? req.user._id : req.admin._id
    });

    if (!score) throw new Error('Score not found');

    // Start a session for a transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Delete the previous score
        const deletedScore = await ScoreModel.findOneAndDelete(
            { test: testId, user: req.user !== undefined ? req.user._id : req.admin._id },
            { session } // Include the session
        );

        if (!deletedScore) throw new Error('Failed to delete the previous score');

        // Delete the corresponding leaderboard entry
        const deletedLeaderboard = await LeaderboardModel.findOneAndDelete(
            { test: testId, user: req.user !== undefined ? req.user._id : req.admin._id },
            { session } // Include the session
        );

        if (!deletedLeaderboard) throw new Error('Failed to delete the previous leaderboard entry');

        // Extract new score details from the request body
        const { totalQuestionsAttempted, totalCorrect, totalIncorrect, timeTaken } = req.body;
        const stats = await calculateScoreStats(totalCorrect, totalIncorrect, totalQuestionsAttempted, testId);

        // Create a new score
        const newScore = await ScoreModel.create([{
            totalQuestionsAttempted,
            totalCorrect,
            totalIncorrect,
            timeTaken,
            test: testId,
            user: req.user !== undefined ? req.user._id : req.admin._id,
            ...stats,
        }], { session });

        // Create a new leaderboard entry
        const newLeaderboard = await LeaderboardModel.create([{
            user: req.user !== undefined ? req.user._id : req.admin._id,
            test: testId,
            score: newScore[0]._id, // Access the newly created score
            rank: stats.rank,
        }], { session });

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        return { message: 'Score updated successfully', data: newScore[0] };
    } catch (error) {
        // Abort the transaction in case of an error
        await session.abortTransaction();
        session.endSession();
        throw error; // Rethrow the error to be handled by the global error handler
    }
});

export const deleteScore = handleAsync(async (req) => {
    const score = await ScoreModel.findById(req.params.id);
    if (!score) throw new Error('Score not found');
    await ScoreModel.findByIdAndDelete(req.params.id);
    return { message: 'Score deleted successfully' };
});

export const getScoreById = handleAsync(async (req) => {
    let query = ScoreModel.findById(req.params.id);
    if (req.admin) {
        query = query.populate('test').populate('user');
    }
    const score = await query;
    if (!score) throw new Error('Score not found');
    return { message: 'Score found successfully', data: score };
});

export const getAllScores = handleAsync(async () => {
    let query = ScoreModel.find();
    if (req.admin) {
        query = query.populate('test').populate('user');
    }
    const scores = await query;
    return { message: 'Scores found successfully', data: scores };
});

export const getScoresByTestId = handleAsync(async (req) => {
    checkAuth(req);
    const score = await ScoreModel.find({ test: req.params.testId, user: req.user._id });
    if (!score) throw new Error('Scores not found');
    return { message: 'Score found successfully', data: score };
});

// // Get Scores by User ID
// export const getScoresByUserId = async (req, res) => {
//     const user = req.user;
//     if (!user) {
//         return res.status(401).json({ message: 'Unauthorized Access' });
//     }

//     try {
//         const scores = await ScoreModel.find({ user: user._id });

//         if (!scores) {
//             return res.status(404).json({ message: 'Scores not found' });
//         }

//         res.status(200).json({ message: 'Scores found successfully', scores });
//     } catch (error) {
//         console.error('Error fetching Scores:', error);
//         res.status(500).json({ message: 'Failed to get Scores', error });
//     }
// };