import LeaderboardModel from "../models/LeaderboardModel.js";

export const getLeaderboardByTestId = async (req, res) => {
    try {
        const leaderboard = await LeaderboardModel.find({ test: req.params.testId }).populate('user', { name: 1, profilePicture: 1 }).populate('score', { totalMarksObtained: 1, totalMarks: 1 }).sort({ 'rank': 1 });
        if (!leaderboard) return res.status(404).json({ message: 'Leaderboard not found' });
        return res.status(200).json({ message: 'Leaderboard found successfully', leaderboard });
    } catch (error) {
        console.error('Error fetching Leaderboard:', error);
        res.status(500).json({ message: 'Failed to get Leaderboard', error });
    }
};