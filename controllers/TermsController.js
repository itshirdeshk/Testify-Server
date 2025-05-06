import TermsModel from "../models/TermsModel.js";

export const createTerms = async (req, res) => {
    try {
        const { title, content } = req.body;
        const terms = await TermsModel.create({ title, content });
        res.status(201).json({ message: 'Terms created successfully', terms });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create Terms', error: error.message });
    }
};

export const updateTerms = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const updatedTerms = await TermsModel.findByIdAndUpdate(id, { title, content }, { new: true });
        if (!updatedTerms) return res.status(404).json({ message: 'Terms not found' });
        res.status(200).json({ message: 'Terms updated successfully', updatedTerms });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update Terms', error: error.message });
    }
};

export const getTermsById = async (req, res) => {
    try {
        const { id } = req.params;
        const terms = await TermsModel.findById(id);
        if (!terms) return res.status(404).json({ message: 'Terms not found' });
        res.status(200).json({ message: 'Terms found successfully', terms });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get Terms', error: error.message });
    }
};

export const getAllTerms = async (req, res) => {
    try {
        const termsList = await TermsModel.find();
        res.status(200).json({ message: 'Terms found successfully', terms: termsList });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get Terms', error: error.message });
    }
};

export const deleteTerms = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTerms = await TermsModel.findByIdAndDelete(id);
        if (!deletedTerms) return res.status(404).json({ message: 'Terms not found' });
        res.status(200).json({ message: 'Terms deleted successfully', deletedTerms });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete Terms', error: error.message });
    }
}; 