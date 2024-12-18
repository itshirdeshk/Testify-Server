import mongoose from 'mongoose';

const { Schema } = mongoose;

const TestSchema = new Schema(
    {
        title: { type: String, required: true },
        totalQuestions: { type: Number, required: true, min: 1 },
        duration: { type: Number, required: true, min: 1 }, // in minutes
        totalMarks: { type: Number, required: true, min: 1 },
        mockTest: { type: mongoose.Schema.Types.ObjectId, ref: 'MockTest', required: true },
        isFree: { type: Boolean, required: true },
    },
    { timestamps: true }
);

const TestModel = mongoose.model('Test', TestSchema);

export default TestModel;
