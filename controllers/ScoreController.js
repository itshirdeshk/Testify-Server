import ScoreModel from '../models/ScoreModel.js';

// Score Controller

// Create a new Score
export const createScore = async (req, res) => {
    const { name, totalQuestionsAttempted, totalCorrect, totalIncorrect, percentage, percentile, accuracy, rank, testId } = req.body;

    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized Access' });
    }

    try {
        const score = await ScoreModel.create({
            name,
            totalQuestionsAttempted,
            totalCorrect,
            totalIncorrect,
            percentage,
            percentile,
            accuracy,
            rank,
            test: testId,
            user: user._id
        });

        res.status(201).json({ message: 'Score created successfully', score });
    } catch (error) {
        console.error('Failed to create Score:', error);
        res.status(500).json({ message: 'Failed to create Score', error });
    }
};


// Update an existing Score by ID
export const updateScore = async (req, res) => {
    const { id } = req.params;
    const { ...updatedData } = req.body;

    try {
        const score = await ScoreModel.findById(id);
        if (!score) {
            return res.status(404).json({ message: 'Score not found' });
        }

        const updatedScore = await ScoreModel.findByIdAndUpdate(id, updatedData, { new: true });

        res.status(200).json({ message: 'Score updated successfully', updatedScore });
    } catch (error) {
        console.error('Failed to update Score:', error);
        res.status(500).json({ message: 'Failed to update Score', error });
    }
};

// Delete a Score by ID
export const deleteScore = async (req, res) => {
    const { id } = req.params;

    try {
        const score = await ScoreModel.findById(id);
        if (!score) {
            return res.status(404).json({ message: 'Score not found' });
        }

        await ScoreModel.findByIdAndDelete(id);

        res.status(200).json({ message: 'Score deleted successfully' });
    } catch (error) {
        console.error('Failed to delete Score:', error);
        res.status(500).json({ message: 'Failed to delete Score', error });
    }
};

// Get a Score by ID
export const getScoreById = async (req, res) => {
    const { id } = req.params;

    try {
        const score = await ScoreModel.findById(id);

        if (!score) {
            return res.status(404).json({ message: 'Score not found' });
        }

        res.status(200).json({ message: 'Score found successfully', score });
    } catch (error) {
        console.error('Error fetching Score:', error);
        res.status(500).json({ message: 'Failed to get Score', error });
    }
};

// Get all Score
export const getAllScores = async (req, res) => {
    try {
        const scores = await ScoreModel.find();

        res.status(200).json({ message: 'Scores found successfully', scores });
    } catch (error) {
        console.error('Error fetching Scores:', error);
        res.status(500).json({ message: 'Failed to get Scores', error });
    }
};

// Get Scores by Test ID
export const getScoresByTestId = async (req, res) => {
    const { testId } = req.params;
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized Access' });
    }

    try {
        const scores = await ScoreModel.find(
            { and: { test: testId, user: user._id } }
        );

        if (!scores) {
            return res.status(404).json({ message: 'Scores not found' });
        }

        res.status(200).json({ message: 'Scores found successfully', scores });
    } catch (error) {
        console.error('Error fetching Scores:', error);
        res.status(500).json({ message: 'Failed to get Scores', error });
    }
};

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