import mongoose from 'mongoose';

const { Schema } = mongoose;

const SubExamSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        exam: {
            type: Schema.Types.ObjectId,
            ref: 'Exam',
            required: true
        }
    },
    { timestamps: true }
);

const SubExamModel = mongoose.model('SubExam', SubExamSchema);

export default SubExamModel;
