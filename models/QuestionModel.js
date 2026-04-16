import mongoose from 'mongoose';

const { Schema } = mongoose;

const QuestionSchema = new Schema(
    {
        title: { type: String, required: true },
        options: [{ text: { type: String, required: true }, isCorrect: { type: Boolean, default: false } }], // Enhanced option structure
        positiveMarks: { type: Number, default: 0, min: 0 },
        negativeMarks: { type: Number, default: 0, min: 0 },
        test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
    },
    { timestamps: true }
);

const QuestionModel = mongoose.model('Question', QuestionSchema);

export default QuestionModel;
