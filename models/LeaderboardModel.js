import mongoose from "mongoose";

const { Schema } = mongoose;

const LeaderboardSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        test: {
            type: Schema.Types.ObjectId,
            ref: "Test",
            required: true,
        },
        score: {
            type: Schema.Types.ObjectId,
            ref: "Score",
            required: true,
        },
        rank: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const LeaderboardModel = mongoose.model("Leaderboard", LeaderboardSchema);

export default LeaderboardModel;
