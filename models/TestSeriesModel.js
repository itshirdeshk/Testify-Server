import mongoose from 'mongoose';

const { Schema } = mongoose;

const TestSeriesSchema = new Schema(
    {
        name: { type: String, required: true },
        image: { type: String },
        totalTests: { type: Number, required: true, min: 0 },
        subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategoryExam', required: true },
        freeTests: { type: Number, required: true, min: 0 },
    },
    { timestamps: true }
);

const TestSeriesModel = mongoose.model('TestSeries', TestSeriesSchema);

export default TestSeriesModel;