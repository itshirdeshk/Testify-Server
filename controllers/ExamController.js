import ExamModel from '../models/ExamModel.js';
import cloudinary from '../cloudinaryConfig/cloudinaryConfig.js';

export const createExam = async (req, res) => {
    const { name, description } = req.body;
    const imageFile = req.file.buffer; // Use buffer instead of path

    try {
        // Upload image to Cloudinary
        const stream = cloudinary.v2.uploader.upload_stream({
            folder: 'exam_images', // Optional: specify a folder in Cloudinary
            public_id: `exam_${Date.now()}`, // Optional: specify a public ID (unique identifier)
            overwrite: true // Overwrite existing image with the same public ID
        }, async (error, result) => {
            if (error) {
                console.error('Cloudinary upload error:', error);
                return res.status(500).json({ status: 'failed', message: 'Image upload failed' });
            }
            // Save exam details in the database
            const exam = await ExamModel.create({
                name,
                image: result.secure_url, // Save the Cloudinary URL
                description
            });

            res.status(201).json({ message: 'Exam created successfully', exam });
        });

        stream.end(imageFile); // End the stream with the image buffer

    } catch (error) {
        console.error('Failed to create exam:', error);
        res.status(500).json({ message: 'Failed to create exam', error });
    }
};

export const updateExam = async (req, res) => {
    const { id } = req.params;
    const { ...updatedExam } = req.body;
    const imageFile = req.file?.buffer; // Handle case where image might not be provided

    try {
        // Find the exam to update
        const exam = await ExamModel.findById(id);
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        // Prepare fields to update
        const updateFields = { ...updatedExam };

        if (imageFile) {
            // Upload new image to Cloudinary
            const stream = cloudinary.v2.uploader.upload_stream({
                folder: 'exam_images', // Optional: specify a folder in Cloudinary
                public_id: `exam_${id}`, // Optional: specify a public ID (unique identifier)
                overwrite: true // Overwrite existing image with the same public ID
            }, async (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    return res.status(500).json({ status: 'failed', message: 'Image upload failed' });
                }

                // Update the image URL
                updateFields.image = result?.secure_url;

                // Update the exam in the database
                const updatedExam = await ExamModel.findByIdAndUpdate(id, updateFields, { new: true });

                res.status(200).json({ message: 'Exam updated successfully', updatedExam });
            })

            stream.end(imageFile); // End the stream with the image buffer
        } else {
            // Update the exam in the database
            const updatedExam = await ExamModel.findByIdAndUpdate(id, updateFields, { new: true });

            res.status(200).json({ message: 'Exam updated successfully', updatedExam });
        }
    } catch (error) {
        console.error('Failed to update exam:', error);
        res.status(500).json({ message: 'Failed to update exam', error: error.message });
    }
};

export const getExamById = async (req, res) => {
    const { id } = req.params;
    try {
        const exam = await ExamModel.findById(id);
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }
        res.status(200).json({ message: 'Exam found successfully', exam });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get exam', error: error.message });
    }
};

export const getAllExams = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const totalDocs = await ExamModel.countDocuments();
        const totalPages = Math.ceil(totalDocs / limit);

        const exams = await ExamModel.find()
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            exams,
            pagination: {
                currentPage: page,
                totalPages,
                totalDocs,
                hasPrevPage: page > 1,
                hasNextPage: page < totalPages
            }
        });
    } catch (error) {
        console.error('Error fetching exams:', error);
        res.status(500).json({ message: 'Failed to get exams', error: error.message });
    }
};

export const deleteExam = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedExam = await ExamModel.findByIdAndDelete(id);
        if (!deletedExam) {
            return res.status(404).json({ message: 'Exam not found' });
        }
        res.status(200).json({ message: 'Exams deleted successfully', deletedExam });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete exam', error: error.message });
    }
};