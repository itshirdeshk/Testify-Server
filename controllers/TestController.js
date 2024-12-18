import TestModel from '../models/TestModel.js';

// Test Controller

// Create a new Test
export const createTest = async (req, res) => {
    const { title, totalQuestions, duration, totalMarks, mockTestId, isFree } = req.body;

    try {
        const test = await TestModel.create({
            title,
            totalQuestions,
            duration,
            totalMarks,
            mockTest: mockTestId,
            isFree
        });

        res.status(201).json({ message: 'Test created successfully', test });
    } catch (error) {
        console.error('Failed to create Test:', error);
        res.status(500).json({ message: 'Failed to create Test', error });
    }
};



// Update an existing Test by ID
export const updateTest = async (req, res) => {
    const { id } = req.params;
    const { ...updatedData } = req.body;

    try {
        const test = await TestModel.findById(id);
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        const updatedTest = await TestModel.findByIdAndUpdate(id, updatedData, { new: true });

        res.status(200).json({ message: 'Test updated successfully', updatedTest });
    } catch (error) {
        console.error('Failed to update Test:', error);
        res.status(500).json({ message: 'Failed to update Test', error });
    }
};

// Delete a Test by ID
export const deleteTest = async (req, res) => {
    const { id } = req.params;

    try {
        const test = await TestModel.findById(id);
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        await TestModel.findByIdAndDelete(id);

        res.status(200).json({ message: 'Test deleted successfully' });
    } catch (error) {
        console.error('Failed to delete Test:', error);
        res.status(500).json({ message: 'Failed to delete Test', error });
    }
};

// Get a Test by ID
export const getTestById = async (req, res) => {
    const { id } = req.params;

    try {
        const test = await TestModel.findById(id);

        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        res.status(200).json({ message: 'Test found successfully', test });
    } catch (error) {
        console.error('Error fetching Test:', error);
        res.status(500).json({ message: 'Failed to get Test', error });
    }
};

// Get all Test
export const getAllTest = async (req, res) => {
    try {
        const test = await TestModel.find();

        res.status(200).json({ message: 'Test found successfully', test });
    } catch (error) {
        console.error('Error fetching Test:', error);
        res.status(500).json({ message: 'Failed to get Test', error });
    }
};

// Get Test by MockTest ID
export const getTestByMockTestId = async (req, res) => {
    const { mockTestId } = req.params;

    try {
        const test = await TestModel.find({ mockTest: mockTestId });

        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        res.status(200).json({ message: 'Test found successfully', test });
    } catch (error) {
        console.error('Error fetching Test:', error);
        res.status(500).json({ message: 'Failed to get Test', error });
    }
};