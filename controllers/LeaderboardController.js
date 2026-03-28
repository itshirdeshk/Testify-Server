import LeaderboardModel from "../models/LeaderboardModel.js";

export const getLeaderboardByTestId = async (req, res) => {
    try {
        const { testId } = req.params;
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const filter = { test: testId };
        const totalDocs = await LeaderboardModel.countDocuments(filter);
        const totalPages = Math.ceil(totalDocs / limit);

        const leaderboard = await LeaderboardModel.find(filter)
            .populate('user', { name: 1, profilePicture: 1 })
            .populate('score', { totalMarksObtained: 1, totalMarks: 1 })
            .sort({ rank: 1 })
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            message: 'Leaderboard found successfully',
            leaderboard,
            pagination: {
                currentPage: page,
                totalPages,
                totalDocs,
                hasPrevPage: page > 1,
                hasNextPage: page < totalPages
            }
        });
    } catch (error) {
        console.error('Error fetching Leaderboard:', error);
        res.status(500).json({ message: 'Failed to get Leaderboard', error });
    }
};