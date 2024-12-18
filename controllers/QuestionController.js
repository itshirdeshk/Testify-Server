import QuestionModel from '../models/QuestionModel.js';

// Question Controller

// Create a new Question
export const createQuestion = async (req, res) => {
    const { title, options, positiveMarks, negativeMarks, testId } = req.body;

    try {
        const question = await QuestionModel.create({
            title,
            options,
            positiveMarks,
            negativeMarks,
            test: testId
        });

        res.status(201).json({ message: 'Question created successfully', question });
    } catch (error) {
        console.error('Failed to create Question:', error);
        res.status(500).json({ message: 'Failed to create Question', error });
    }
};


// Update an existing Question by ID
export const updateQuestion = async (req, res) => {
    const { id } = req.params;
    const { ...updatedData } = req.body;

    try {
        const question = await QuestionModel.findById(id);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        const updatedQuestion = await QuestionModel.findByIdAndUpdate(id, updatedData, { new: true });

        res.status(200).json({ message: 'Question updated successfully', updatedQuestion });
    }
    catch (error) {
        console.error('Failed to update Question:', error);
        res.status(500).json({ message: 'Failed to update Question', error });
    }
};

// Delete a Question by ID
export const deleteQuestion = async (req, res) => {
    const { id } = req.params;

    try {
        const question = await QuestionModel.findById(id);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        await QuestionModel.findByIdAndDelete(id);

        res.status(200).json({ message: 'Question deleted successfully' });
    } catch (error) {
        console.error('Failed to delete Question:', error);
        res.status(500).json({ message: 'Failed to delete Question', error });
    }
};

// Get a Question by ID
export const getQuestionById = async (req, res) => {
    const { id } = req.params;

    try {
        const question = await QuestionModel.findById(id);

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        res.status(200).json({ message: 'Question found successfully', question });
    } catch (error) {
        console.error('Error fetching Question:', error);
        res.status(500).json({ message: 'Failed to get Question', error });
    }
};

// Get all Question
export const getAllQuestions = async (req, res) => {
    try {
        const question = await QuestionModel.find();

        res.status(200).json({ message: 'Question found successfully', question });
    } catch (error) {
        console.error('Error fetching Question:', error);
        res.status(500).json({ message: 'Failed to get Question', error });
    }
};

// Get Questions by Test ID
export const getQuestionsByTestId = async (req, res) => {
    const { testId } = req.params;

    try {
        const questions = await QuestionModel.find({ test: testId });

        if (!questions) {
            return res.status(404).json({ message: 'Questions not found' });
        }

        res.status(200).json({ message: 'Questions found successfully', questions });
    } catch (error) {
        console.error('Error fetching Questions:', error);
        res.status(500).json({ message: 'Failed to get Questions', error });
    }
};