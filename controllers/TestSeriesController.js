import cloudinary from '../cloudinaryConfig/cloudinaryConfig.js';
import TestSeriesModel from '../models/TestSeriesModel.js';

// Test Series Controller

// Create a new Test Series
export const createTestSeries = async (req, res) => {
    const { name, subExamId } = req.body;
    const imageFile = req.file.buffer;

    try {
        const stream = cloudinary.v2.uploader.upload_stream({
            folder: 'testSeries_images',
            public_id: `testSeries_${Date.now()}`,
            overwrite: true // Overwrite existing image with the same public ID
        }, async (error, result) => {
            if (error) {
                console.error('Cloudinary upload error:', error);
                return res.status(500).json({ status: 'failed', message: 'Image upload failed' });
            }

            const testSeries = await TestSeriesModel.create({
                name,
                image: result.secure_url,
                subExam: subExamId,
            });

            res.status(201).json({ message: 'TestSeries created successfully', testSeries });
        })

        stream.end(imageFile);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create TestSeries', error });
        console.error('Failed to create TestSeries:', error);
    }
};



// Update an existing MockTest by ID
export const updateTestseries = async (req, res) => {
    const { id } = req.params;
    const { ...updatedData } = req.body;
    const imageFile = req.file?.buffer;

    try {

        const testSeries = await TestSeriesModel.findById(id);
        if (!testSeries) {
            return res.status(404).json({ message: 'TestSeries not found' });
        }

        const updateFields = { ...updatedData };

        if (imageFile) {
            const stream = cloudinary.v2.uploader.upload_stream({
                folder: 'testSeries_images',
                public_id: `testSeries_${id}`,
                overwrite: true // Overwrite existing image with the same public ID
            }, async (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    return res.status(500).json({ status: 'failed', message: 'Image upload failed' });
                }
                updateFields.image = result.secure_url;

                const updatedTestSeries = await TestSeriesModel.findByIdAndUpdate(id, updateFields, { new: true });

                res.status(200).json({ message: 'TestSeries updated successfully', updatedTestSeries });
            })
            stream.end(imageFile);
        } else {
            const updatedTestSeries = await TestSeriesModel.findByIdAndUpdate(id, updateFields, { new: true });

            res.status(200).json({ message: 'TestSeries updated successfully', updatedTestSeries });
        }
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
        const TestSeries = await TestSeriesModel.findById(id);

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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { name } = req.query;

    try {
        // Build filter object based on provided query parameters
        const filter = {};
        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }

        const totalDocs = await TestSeriesModel.countDocuments(filter);
        const totalPages = Math.ceil(totalDocs / limit);

        let query = TestSeriesModel.find(filter)
            .skip(skip)
            .limit(limit);

        if (req.admin) {
            query = query.populate('subExam');
        }

        const testSeries = await query;

        res.status(200).json({
            testSeries,
            pagination: {
                currentPage: page,
                totalPages,
                totalDocs,
                hasPrevPage: page > 1,
                hasNextPage: page < totalPages
            }
        });
    } catch (error) {
        console.error('Error fetching test series:', error);
        res.status(500).json({ message: 'Failed to get test series', error: error.message });
    }
};

// Get TestSeries by SubCategory ID
export const getTestSeriesBySubExamId = async (req, res) => {
    const { subExamId } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const { name } = req.query;

    try {
        const filter = { subExam: subExamId };
        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }

        const totalDocs = await TestSeriesModel.countDocuments(filter);
        const totalPages = Math.ceil(totalDocs / limit);

        let query = TestSeriesModel.find(filter)
            .skip(skip)
            .limit(limit);

        if (req.admin) {
            query = query.populate('subExam');
        }

        const testSeries = await query;

        res.status(200).json({
            message: 'TestSeries found successfully',
            testSeries,
            pagination: {
                currentPage: page,
                totalPages,
                totalDocs,
                hasPrevPage: page > 1,
                hasNextPage: page < totalPages
            }
        });
    } catch (error) {
        console.error('Error fetching TestSeries:', error);
        res.status(500).json({ message: 'Failed to get TestSeries', error });
    }
};