import mongoose from 'mongoose';

const { Schema } = mongoose;

const TestSeriesSchema = new Schema(
    {
        name: { type: String, required: true },
        image: { type: String ,required: true},
        totalTests: { type: Number, min: 0 },
        freeTests: { type: Number, min: 0 },
        subExam: { type: mongoose.Schema.Types.ObjectId, ref: 'SubExam', required: true },
    },
    { timestamps: true }
);

const TestSeriesModel = mongoose.model('TestSeries', TestSeriesSchema);

export default TestSeriesModel;