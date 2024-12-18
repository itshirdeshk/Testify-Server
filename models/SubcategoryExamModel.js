import mongoose from 'mongoose';

const { Schema } = mongoose;

const SubCategoryExamSchema = new Schema(
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

const SubCategoryExamModel = mongoose.model('SubCategoryExam', SubCategoryExamSchema);

export default SubCategoryExamModel;
