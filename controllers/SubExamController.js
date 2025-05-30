import cloudinary from "../cloudinaryConfig/cloudinaryConfig.js";
import SubExamModel from "../models/SubExamModel.js";

// Subcategory of exams 

// Create a new subcategory
export const createSubExam = async (req, res) => {
    const { name, description, examId } = req.body;
    const imageFile = req.file.buffer; // Use buffer instead of path

    try {
        let imageUrl = ''; // Default to empty if no image is uploaded

        if (imageFile) {
            // Upload image to Cloudinary
            const stream = cloudinary.v2.uploader.upload_stream({
                folder: 'subExam_images', // Optional: specify a folder in Cloudinary
                public_id: `subExam_${Date.now()}`, // Optional: specify a public ID (unique identifier)
                overwrite: true // Overwrite existing image with the same public ID
            }, async (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    return res.status(500).json({ message: 'Image upload failed', error: error.message });
                }
                imageUrl = result.secure_url; // Set the image URL after upload

                const subExam = await SubExamModel.create({
                    name,
                    image: imageUrl,
                    description,
                    exam: examId // Assign exam ID to the subExam
                });

                res.status(201).json({ message: 'SubExam created successfully', subExam });
            })
            stream.end(imageFile); // End the stream with the image buffer
        } else {
            res.status(500).json({ message: 'Failed to create subExam', error: 'Image file is required' });
        }
    } catch (error) {
        console.error('Failed to create subExam:', error);
        res.status(500).json({ message: 'Failed to create subExam', error: error.message });
    }
};

// Update an existing subcategory by ID
export const updateSubExam = async (req, res) => {
    const { id } = req.params;
    const { ...updatedData } = req.body;
    const imageFile = req.file?.buffer; // Handle case where image might not be provided

    try {
        // Prepare fields to update
        const updateFields = { ...updatedData };

        if (imageFile) {
            // Upload new image to Cloudinary
            const stream = cloudinary.v2.uploader.upload_stream({
                folder: 'subExam_images', // Optional: specify a folder in Cloudinary
                public_id: `subExam_${id}`, // Optional: specify a public ID (unique identifier)
                overwrite: true // Overwrite existing image with the same public ID
            }, async (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    return res.status(500).json({ message: 'Image upload failed', error: error.message });
                }
                updateFields.image = result?.secure_url; // Set the new image URL

                const updatedSubExam = await SubExamModel.findByIdAndUpdate(id, updateFields, { new: true });

                res.status(200).json({ message: 'SubExam updated successfully', updatedSubExam });
            });
            stream.end(imageFile); // End the stream with the image buffer
        } else {
            const updatedSubExam = await SubExamModel.findByIdAndUpdate(id, updateFields, { new: true });

            res.status(200).json({ message: 'SubExam updated successfully', updatedSubExam });
        }
    } catch (error) {
        console.error('Failed to update subcategory:', error);
        res.status(500).json({ message: 'Failed to update subcategory', error: error.message });
    }
};

export const deleteSubExam = async (req, res) => {
    const { id } = req.params;

    try {
        const subExam = await SubExamModel.findById(id);
        if (!subExam) {
            return res.status(404).json({ message: 'SubExam not found' });
        }

        await SubExamModel.findByIdAndDelete(id);

        res.status(200).json({ message: 'SubExam deleted successfully' });
    } catch (error) {
        console.error('Failed to delete SubExam:', error);
        res.status(500).json({ message: 'Failed to delete SubExam', error });
    }
};

export const getSubExamById = async (req, res) => {
    const { id } = req.params;

    try {
        let query = SubExamModel.findById(id);
        if (req.admin) {
            query = query.populate('exam');
        }
        const subExam = await query;

        if (!subExam) {
            return res.status(404).json({ message: 'SubExam not found' });
        }

        res.status(200).json({ message: 'SubExam found successfully', subExam });
    } catch (error) {
        console.error('Error fetching SubExam:', error);
        res.status(500).json({ message: 'Failed to get SubExam', error });
    }
};

// Get all subcategories
export const getAllSubExams = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        // Get total count of documents
        const totalDocs = await SubExamModel.countDocuments();
        const totalPages = Math.ceil(totalDocs / limit);

        let query = SubExamModel.find()
            .skip(skip)
            .limit(limit);

        if (req.admin) {
            query = query.populate('exam');
        }

        const subExams = await query;

        res.status(200).json({
            subExams,
            pagination: {
                currentPage: page,
                totalPages,
                totalDocs,
                hasPrevPage: page > 1,
                hasNextPage: page < totalPages
            }
        });
    } catch (error) {
        console.error('Error fetching SubExams:', error);
        res.status(500).json({
            message: 'Failed to get SubExams',
            error: error.message
        });
    }
};

// Get Subcategories by Exam ID
export const getSubExamsByExamId = async (req, res) => {
    try {
        const { examId } = req.params;
        const subExams = await SubExamModel.find({ exam: examId });
        res.status(200).json({
            message: 'SubExams found successfully',
            subExams
        });
    } catch (error) {
        console.error('Error fetching SubExams:', error);
        res.status(500).json({
            message: 'Failed to get SubExams',
            error: error.message
        });
    }
};