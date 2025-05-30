import ExamModel from '../models/ExamModel.js';
import cloudinary from '../cloudinaryConfig/cloudinaryConfig.js';
import ResourceModel from '../models/ResourceModel.js';

export const createResource = async (req, res) => {
    const { title, description, typeOfFile, exam, subExam } = req.body;
    const resourceFile = req.file.buffer;

    try {
        // Upload image to Cloudinary
        const stream = cloudinary.v2.uploader.upload_stream({
            resource_type: 'raw',
            folder: 'resources/',
            overwrite: true
        }, async (error, result) => {
            if (error) {
                console.error('Cloudinary upload error:', error);
                return res.status(500).json({ status: 'failed', message: 'File upload failed' });
            }
            // Save exam details in the database
            const resource = await ResourceModel.create({
                title,
                url: result.secure_url, // Save the Cloudinary URL
                size: ((result.bytes) / 1000000).toFixed(2),
                description,
                typeOfFile,
                exam,
                subExam
            });

            res.status(201).json({ message: 'Resource created successfully', resource });
        });

        stream.end(resourceFile); // End the stream with the image buffer

    } catch (error) {
        console.error('Failed to create resource:', error);
        res.status(500).json({ message: 'Failed to create resource', error });
    }
};

export const updateResource = async (req, res) => {
    const { id } = req.params;
    const { ...updatedResource } = req.body;
    const resourceFile = req.file?.buffer;

    try {
        // Find the exam to update
        const resource = await ResourceModel.findById(id);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        // Prepare fields to update
        const updateFields = { ...updatedResource };

        if (resourceFile) {
            // Upload new image to Cloudinary
            const stream = cloudinary.v2.uploader.upload_stream({
                resource_type: 'raw',
                folder: 'resources/',
                overwrite: true
            }, async (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    return res.status(500).json({ status: 'failed', message: 'Resource upload failed' });
                }

                // Update the image URL
                updateFields.url = result?.secure_url;
                updateFields.size = result?.bytes;

                // Update the exam in the database
                const updatedResource = await ResourceModel.findByIdAndUpdate(id, updateFields, { new: true });

                res.status(200).json({ message: 'Resource updated successfully', updatedExam });
            })

            stream.end(resourceFile); // End the stream with the image buffer
        } else {
            // Update the exam in the database
            const updatedResource = await ResourceModel.findByIdAndUpdate(id, updateFields, { new: true });

            res.status(200).json({ message: 'Resource updated successfully', updatedResource });
        }
    } catch (error) {
        console.error('Failed to update exam:', error);
        res.status(500).json({ message: 'Failed to update exam', error: error.message });
    }
};

export const getResourceById = async (req, res) => {
    const { id } = req.params;
    try {
        let query = ResourceModel.findById(id);
        if (req.admin) {
            query = query.populate('exam').populate('subExam');
        }
        const resource = await query;
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }
        res.status(200).json({ message: 'Resource found successfully', resource });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get resource', error: error.message });
    }
};

export const getAllResources = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { title } = req.query;

    try {
        // Build filter object based on provided query parameters
        const filter = {};
        if (title) {
            filter.title = { $regex: title, $options: 'i' };
        }

        const totalDocs = await ResourceModel.countDocuments(filter);
        const totalPages = Math.ceil(totalDocs / limit);

        let query = ResourceModel.find(filter)
            .skip(skip)
            .limit(limit);

        if (req.admin) {
            query = query.populate('exam').populate('subExam');
        }

        const resources = await query;

        res.status(200).json({
            resources,
            pagination: {
                currentPage: page,
                totalPages,
                totalDocs,
                hasPrevPage: page > 1,
                hasNextPage: page < totalPages
            }
        });
    } catch (error) {
        console.error('Error fetching resources:', error);
        res.status(500).json({ message: 'Failed to get resources', error: error.message });
    }
};

export const getResourcesBySubExamId = async (req, res) => {
    const { subExamId } = req.params;
    try {
        const resources = await ResourceModel.find({ subExam: subExamId });
        if (!resources) {
            return res.status(404).json({ message: 'Resources not found' });
        }
        res.status(200).json({ message: 'Resources found successfully', resources });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get resources', error: error.message });
    }
};

export const deleteResource = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedResource = await ResourceModel.findByIdAndDelete(id);
        if (!deletedResource) {
            return res.status(404).json({ message: 'Resource not found' });
        }
        res.status(200).json({ message: 'Resource deleted successfully', deletedResource });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete resource', error: error.message });
    }
};   