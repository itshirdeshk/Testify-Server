import mongoose from 'mongoose';

const { Schema } = mongoose;

const MockTestSchema = new Schema(
    {
        name: { type: String, required: true },
        totalTests: { type: Number, required: true, min: 0 },
        testSeries: { type: mongoose.Schema.Types.ObjectId, ref: 'TestSeries', required: true },
        freeTests: { type: Number, required: true, min: 0 },
    },
    { timestamps: true }
);

const MockTestModel = mongoose.model('MockTest', MockTestSchema);

export default MockTestModel;
