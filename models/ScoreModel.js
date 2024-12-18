import mongoose from 'mongoose';

const { Schema } = mongoose;

const ScoreSchema = new Schema(
    {
        totalQuestionsAttempted: { type: Number, required: true, min: 0 },
        totalCorrect: { type: Number, required: true, min: 0 },
        totalIncorrect: { type: Number, required: true, min: 0 },
        percentage: { type: Number, required: true, min: 0, max: 100 },
        percentile: { type: Number, required: true, min: 0, max: 100 },
        accuracy: { type: Number, required: true, min: 0, max: 100 }, // correct/attempted ratio as percentage
        rank: { type: Number, required: true, min: 1 },
        test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

const ScoreModel = mongoose.model('Score', ScoreSchema);

export default ScoreModel;
