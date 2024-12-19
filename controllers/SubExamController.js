import cloudinary from "../cloudinaryConfig/cloudinaryConfig.js";
import SubCategoryExamModel from "../models/SubExamModel.js";

// Subcategory of exams 

// Create a new subcategory
export const createSubcategory = async (req, res) => {
    const { name, description, examId } = req.body;
    const imageFile = req.file.buffer; // Use buffer instead of path

    try {
        let imageUrl = ''; // Default to empty if no image is uploaded

        if (imageFile) {
            // Upload image to Cloudinary
            const stream = cloudinary.v2.uploader.upload_stream({
                folder: 'subcategory_images', // Optional: specify a folder in Cloudinary
                public_id: `subcategory_${Date.now()}`, // Optional: specify a public ID (unique identifier)
                overwrite: true // Overwrite existing image with the same public ID
            }, async (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    return res.status(500).json({ message: 'Image upload failed', error: error.message });
                }
                imageUrl = result.secure_url; // Set the image URL after upload

                const subcategory = await SubCategoryExamModel.create({
                    name,
                    image: imageUrl,
                    description,
                    exam: examId // Assign exam ID to the subcategory
                });

                res.status(201).json({ message: 'Subcategory created successfully', subcategory });
            })
            stream.end(imageFile); // End the stream with the image buffer
        } else {
            res.status(500).json({ message: 'Failed to create subcategory', error: 'Image file is required' });
        }
    } catch (error) {
        console.error('Failed to create subcategory:', error);
        res.status(500).json({ message: 'Failed to create subcategory', error: error.message });
    }
};

// Update an existing subcategory by ID
export const updateSubcategory = async (req, res) => {
    const { id } = req.params;
    const { ...updatedData } = req.body;
    const imageFile = req.file?.buffer; // Handle case where image might not be provided

    try {
        // Prepare fields to update
        const updateFields = { ...updatedData };

        if (imageFile) {
            // Upload new image to Cloudinary
            const stream = cloudinary.v2.uploader.upload_stream({
                folder: 'subcategory_images', // Optional: specify a folder in Cloudinary
                public_id: `subcategory_${id}`, // Optional: specify a public ID (unique identifier)
                overwrite: true // Overwrite existing image with the same public ID
            }, async (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    return res.status(500).json({ message: 'Image upload failed', error: error.message });
                }
                updateFields.image = result?.secure_url; // Set the new image URL

                const updatedSubcategory = await SubCategoryExamModel.findByIdAndUpdate(id, updateFields, { new: true });

                res.status(200).json({ message: 'Subcategory updated successfully', updatedSubcategory });
            });
            stream.end(imageFile); // End the stream with the image buffer
        } else {
            const updatedSubcategory = await SubCategoryExamModel.findByIdAndUpdate(id, updateFields, { new: true });

            res.status(200).json({ message: 'Subcategory updated successfully', updatedSubcategory });
        }
    } catch (error) {
        console.error('Failed to update subcategory:', error);
        res.status(500).json({ message: 'Failed to update subcategory', error: error.message });
    }
};

export const deleteSubcategory = async (req, res) => {
    const { id } = req.params;

    try {
        const subcategory = await SubCategoryExamModel.findById(id);
        if (!subcategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }

        await SubCategoryExamModel.findByIdAndDelete(id);

        res.status(200).json({ message: 'Subcategory deleted successfully' });
    } catch (error) {
        console.error('Failed to delete Subcategory:', error);
        res.status(500).json({ message: 'Failed to delete Subcategory', error });
    }
};

export const getSubcategoryById = async (req, res) => {
    const { id } = req.params;

    try {
        const subcategory = await SubCategoryExamModel.findById(id);

        if (!subcategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }

        res.status(200).json({ message: 'Subcategory found successfully', subcategory });
    } catch (error) {
        console.error('Error fetching Subcategory:', error);
        res.status(500).json({ message: 'Failed to get Subcategory', error });
    }
};

// Get all subcategories
export const getAllSubcategories = async (req, res) => {
    try {
        const subcategories = await SubCategoryExamModel.find().populate('exam');
        res.status(200).json({
            message: 'Subcategories of exam found successfully',
            subcategory: subcategories
        });
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        res.status(500).json({
            message: 'Failed to get subcategories',
            error: error.message
        });
    }
};

// Get Subcategories by Exam ID
export const getSubcategoriesByExamId = async (req, res) => {
    try {
        const { examId } = req.params;
        const subcategories = await SubCategoryExamModel.find({ examId: examId });
        res.status(200).json({
            message: 'Subcategories of exam found successfully',
            subcategories
        });
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        res.status(500).json({
            message: 'Failed to get subcategories',
            error: error.message
        });
    }
};