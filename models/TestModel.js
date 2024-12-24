import mongoose from 'mongoose';

const { Schema } = mongoose;

const TestSchema = new Schema(
    {
        title: { type: String, required: true },
        totalQuestions: { type: Number, required: true, min: 1 },
        duration: { type: Number, required: true, min: 1 }, // in minutes
        totalMarks: { type: Number, required: true, min: 1 },
        isFree: { type: Boolean, required: true },
        positiveMarks: { type: Number, required: true, min: 0 },
        negativeMarks: { type: Number, default: 0, min: 0 },
        mockTest: { type: mongoose.Schema.Types.ObjectId, ref: 'MockTest', required: true },
    },
    { timestamps: true }
);

const TestModel = mongoose.model('Test', TestSchema);

export default TestModel;
