import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the schema for the exam
const ExamSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: '', // Default value for the image URL
  },
  description: {
    type: String,
    default: '', // Default value for the description
  },
}, { timestamps: true });

// Create a model using the schema
const ExamModel = mongoose.model('Exam', ExamSchema);

export default ExamModel;
