import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    test: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
        required: true
    },
    totalQuestionsAttempted: {
        type: Number,
        required: true
    },
    totalCorrect: {
        type: Number,
        required: true
    },
    totalIncorrect: {
        type: Number,
        required: true
    },
    totalMarksObtained: {
        type: Number,
        required: true
    },
    totalMarks: {
        type: Number,
        required: true,
        min: 0
    },
    accuracy: {
        type: Number,
        required: true
    },
    percentage: {
        type: Number,
        required: true
    },
    percentile: {
        type: Number,
        required: true
    },
    rank: {
        type: Number,
        required: true
    },
    timeTaken: {
        type: Number,
        default: 0
    },
    testStats: {
        totalParticipants: {
            type: Number,
            required: true
        },
        averageScore: {
            type: Number,
            required: true
        },
        bestScore: {
            type: Number,
            required: true
        }
    }
}, { timestamps: true });

export default mongoose.model('Score', scoreSchema);
