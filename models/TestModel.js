import mongoose from 'mongoose';

const { Schema } = mongoose;

const TestSchema = new Schema(
    {
        title: { type: String, required: true },
        totalQuestions: { type: Number, default: 0 },
        duration: { type: Number, required: true }, // in minutes
        totalMarks: { type: Number, default: 0 },
        isFree: { type: Boolean, required: true },
        positiveMarks: { type: Number, min: 0, required: true },
        negativeMarks: { type: Number, min: 0, default: 0 },
        mockTest: { type: mongoose.Schema.Types.ObjectId, ref: 'MockTest', required: true },
    },
    { timestamps: true }
);

const TestModel = mongoose.model('Test', TestSchema);

export default TestModel;
