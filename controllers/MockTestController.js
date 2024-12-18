import MockTestModel from "../models/MockTestModel.js";

// Mocktest of exams 

// Create a new mockTest
export const createMockTest = async (req, res) => {
    const { name, totalTests, testSeriesId, freeTests } = req.body;

    try {
        const mockTest = await MockTestModel.create({
            name,
            totalTests,
            testSeries: testSeriesId,
            freeTests
        });

        res.status(201).json({ message: 'MockTest created successfully', mockTest });
    } catch (error) {
        console.error('Failed to create MockTest:', error);
        res.status(500).json({ message: 'Failed to create MockTest', error });
    }
};



// Update an existing MockTest by ID
export const updateMockTest = async (req, res) => {
    const { id } = req.params;
    const { ...updatedData } = req.body;

    try {
        const updatedMockTest = await MockTestModel.findByIdAndUpdate(
            id,
            { ...updatedData },
            { new: true }
        );

        res.status(200).json({ message: 'MockTest updated successfully', MockTest: updatedMockTest });
    } catch (error) {
        console.error('Failed to update MockTest:', error);
        res.status(500).json({ message: 'Failed to update MockTest', error });
    }
};

// Delete a MockTest by ID
export const deleteMockTest = async (req, res) => {
    const { id } = req.params;

    try {
        await MockTestModel.findByIdAndDelete(id);
        res.status(200).json({ message: 'MockTest deleted successfully' });
    } catch (error) {
        console.error('Failed to delete MockTest:', error);
        res.status(500).json({ message: 'Failed to delete MockTest', error });
    }
};

// Get a MockTest by ID
export const getMockTestById = async (req, res) => {
    const { id } = req.params;

    try {
        const MockTest = await MockTestModel.findById(id).populate('testSeries');

        if (!MockTest) {
            return res.status(404).json({ message: 'MockTest not found' });
        }

        res.status(200).json({ message: 'MockTest found successfully', MockTest });
    } catch (error) {
        console.error('Error fetching MockTest:', error);
        res.status(500).json({ message: 'Failed to get MockTest', error });
    }
};

// Get all MockTests
export const getAllMockTests = async (req, res) => {
    try {
        const MockTests = await MockTestModel.find().populate('testSeries');
        res.status(200).json(MockTests);
        res.status(200).json({ message: 'MockTests found successfully', MockTests });
    } catch (error) {
        console.error('Error fetching MockTests:', error);
        res.status(500).json({ message: 'Failed to get MockTests', error });
    }
};

// Get MockTests by TestSeries ID
export const getMockTestsByTestSeriesId = async (req, res) => {
    const { testSeriesId } = req.params;

    try {
        const MockTests = await MockTestModel.find({ testSeries: testSeriesId });

        if (!MockTests) {
            return res.status(404).json({ message: 'MockTests not found' });
        }

        res.status(200).json({ message: 'MockTests found successfully', MockTests });
    } catch (error) {
        console.error('Error fetching MockTests:', error);
        res.status(500).json({ message: 'Failed to get MockTests', error });
    }
};