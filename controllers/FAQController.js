import FAQModel from "../models/FAQModel.js";

export const createFAQ = async (req, res) => {
    try {
        const { question, answer } = req.body;
        const faq = await FAQModel.create({ question, answer });
        res.status(201).json({ message: 'FAQ created successfully', faq });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create FAQ', error: error.message });
    }
};

export const updateFAQ = async (req, res) => {
    try {
        const { id } = req.params;
        const { question, answer } = req.body;
        const updatedFAQ = await FAQModel.findByIdAndUpdate(id, { question, answer }, { new: true });
        if (!updatedFAQ) return res.status(404).json({ message: 'FAQ not found' });
        res.status(200).json({ message: 'FAQ updated successfully', updatedFAQ });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update FAQ', error: error.message });
    }
};

export const getFAQById = async (req, res) => {
    try {
        const { id } = req.params;
        const faq = await FAQModel.findById(id);
        if (!faq) return res.status(404).json({ message: 'FAQ not found' });
        res.status(200).json({ message: 'FAQ found successfully', faq });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get FAQ', error: error.message });
    }
};

export const getAllFAQs = async (req, res) => {
    try {
        const faqs = await FAQModel.find();
        res.status(200).json({ message: 'FAQs found successfully', faqs });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get FAQs', error: error.message });
    }
};

export const deleteFAQ = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedFAQ = await FAQModel.findByIdAndDelete(id);
        if (!deletedFAQ) return res.status(404).json({ message: 'FAQ not found' });
        res.status(200).json({ message: 'FAQ deleted successfully', deletedFAQ });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete FAQ', error: error.message });
    }
}; 