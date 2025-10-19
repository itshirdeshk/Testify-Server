import mongoose from 'mongoose';

const { Schema } = mongoose;

const MockTestSchema = new Schema(
    {
        name: { type: String, required: true },
        totalTests: { type: Number, min: 0, default: 0 },
        freeTests: { type: Number, min: 0, default: 0 },
        testSeries: { type: mongoose.Schema.Types.ObjectId, ref: 'TestSeries', required: true },
    },
    { timestamps: true }
);

const MockTestModel = mongoose.model('MockTest', MockTestSchema);

export default MockTestModel;
