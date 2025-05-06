import AboutUsModel from "../models/AboutUsModel.js";

export const createAboutUs = async (req, res) => {
    try {
        const { title, content } = req.body;
        const aboutUs = await AboutUsModel.create({ title, content });
        res.status(201).json({ message: 'About Us created successfully', aboutUs });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create About Us', error: error.message });
    }
};

export const updateAboutUs = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const updatedAboutUs = await AboutUsModel.findByIdAndUpdate(id, { title, content }, { new: true });
        if (!updatedAboutUs) return res.status(404).json({ message: 'About Us not found' });
        res.status(200).json({ message: 'About Us updated successfully', updatedAboutUs });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update About Us', error: error.message });
    }
};

export const getAboutUsById = async (req, res) => {
    try {
        const { id } = req.params;
        const aboutUs = await AboutUsModel.findById(id);
        if (!aboutUs) return res.status(404).json({ message: 'About Us not found' });
        res.status(200).json({ message: 'About Us found successfully', aboutUs });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get About Us', error: error.message });
    }
};

export const getAllAboutUs = async (req, res) => {
    try {
        const aboutUsList = await AboutUsModel.find();
        res.status(200).json({ message: 'About Us found successfully', aboutUs: aboutUsList });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get About Us', error: error.message });
    }
};

export const deleteAboutUs = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAboutUs = await AboutUsModel.findByIdAndDelete(id);
        if (!deletedAboutUs) return res.status(404).json({ message: 'About Us not found' });
        res.status(200).json({ message: 'About Us deleted successfully', deletedAboutUs });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete About Us', error: error.message });
    }
}; 