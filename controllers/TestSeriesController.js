import TestSeriesModel from '../models/TestSeriesModel.js';

// Test Series Controller

// Create a new Test Series
export const createTestSeries = async (req, res) => {
    const { name, totalTests, subCategoryId, freeTests } = req.body;
    const imageFile = req.file?.path;

    try {
        const result = await cloudinary.v2.uploader.upload(imageFile, {
            folder: 'testSeries_images',
            public_id: `testSeries_${Date.now()}`,
            overwrite: true // Overwrite existing image with the same public ID
        });

        const testSeries = await TestSeriesModel.create({
            name,
            image: result.secure_url,
            totalTests,
            subCategory: subCategoryId,
            freeTests
        });

        res.status(201).json({ message: 'TestSeries created successfully', testSeries });
    } catch (error) {
        console.error('Failed to create TestSeries:', error);
        res.status(500).json({ message: 'Failed to create TestSeries', error });
    }
};



// Update an existing MockTest by ID
export const updateTestseries = async (req, res) => {
    const { id } = req.params;
    const { ...updatedData } = req.body;
    const imageFile = req.file.path;

    try {

        const testSeries = await TestSeriesModel.findById(id);
        if (!testSeries) {
            return res.status(404).json({ message: 'TestSeries not found' });
        }

        const updateFields = { ...updatedData };

        if (imageFile) {
            const result = await cloudinary.v2.uploader.upload(imageFile, {
                folder: 'testSeries_images',
                public_id: `testSeries_${id}`,
                overwrite: true
            });

            updateFields.image = result.secure_url;
        }

        const updatedTestSeries = await TestSeriesModel.findByIdAndUpdate(id, updateFields, { new: true });

        res.status(200).json({ message: 'TestSeries updated successfully', updatedTestSeries });
    } catch (error) {
        console.error('Failed to update TestSeries:', error);
        res.status(500).json({ message: 'Failed to update TestSeries', error });
    }
};

// Delete a MockTest by ID
export const deleteTestSeries = async (req, res) => {
    const { id } = req.params;

    try {
        await TestSeriesModel.findByIdAndDelete(id);
        res.status(200).json({ message: 'TestSeries deleted successfully' });
    } catch (error) {
        console.error('Failed to delete TestSeries:', error);
        res.status(500).json({ message: 'Failed to delete TestSeries', error });
    }
};

// Get a TestSeries by ID
export const getTestSeriesById = async (req, res) => {
    const { id } = req.params;

    try {
        const TestSeries = await TestSeriesModel.findById(id).populate('subCategory');

        if (!TestSeries) {
            return res.status(404).json({ message: 'TestSeries not found' });
        }

        res.status(200).json({ message: 'TestSeries found successfully', TestSeries });
    } catch (error) {
        console.error('Error fetching TestSeries:', error);
        res.status(500).json({ message: 'Failed to get TestSeries', error });
    }
};

// Get all TestSeries
export const getAllTestSeries = async (req, res) => {
    try {
        const TestSeries = await TestSeriesModel.find().populate('subCategory');

        res.status(200).json({ message: 'TestSeries found successfully', TestSeries });
    } catch (error) {
        console.error('Error fetching TestSeries:', error);
        res.status(500).json({ message: 'Failed to get TestSeries', error });
    }
};

// Get TestSeries by SubCategory ID
export const getTestSeriesBySubCategoryId = async (req, res) => {
    const { subCategoryId } = req.params;

    try {
        const TestSeries = await TestSeriesModel.find({ subCategory: subCategoryId });

        res.status(200).json({ message: 'TestSeries found successfully', TestSeries });
    } catch (error) {
        console.error('Error fetching TestSeries:', error);
        res.status(500).json({ message: 'Failed to get TestSeries', error });
    }
};