import PrivacyPolicyModel from "../models/PrivacyPolicyModel.js";

export const createPrivacyPolicy = async (req, res) => {
    try {
        const { title, content } = req.body;
        const privacyPolicy = await PrivacyPolicyModel.create({ title, content });
        res.status(201).json({ message: 'Privacy Policy created successfully', privacyPolicy });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create Privacy Policy', error: error.message });
    }
};

export const updatePrivacyPolicy = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const updatedPrivacyPolicy = await PrivacyPolicyModel.findByIdAndUpdate(id, { title, content }, { new: true });
        if (!updatedPrivacyPolicy) return res.status(404).json({ message: 'Privacy Policy not found' });
        res.status(200).json({ message: 'Privacy Policy updated successfully', updatedPrivacyPolicy });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update Privacy Policy', error: error.message });
    }
};

export const getPrivacyPolicyById = async (req, res) => {
    try {
        const { id } = req.params;
        const privacyPolicy = await PrivacyPolicyModel.findById(id);
        if (!privacyPolicy) return res.status(404).json({ message: 'Privacy Policy not found' });
        res.status(200).json({ message: 'Privacy Policy found successfully', privacyPolicy });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get Privacy Policy', error: error.message });
    }
};

export const getAllPrivacyPolicies = async (req, res) => {
    try {
        const privacyPolicies = await PrivacyPolicyModel.find();
        res.status(200).json({ message: 'Privacy Policies found successfully', privacyPolicies });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get Privacy Policies', error: error.message });
    }
};

export const deletePrivacyPolicy = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPrivacyPolicy = await PrivacyPolicyModel.findByIdAndDelete(id);
        if (!deletedPrivacyPolicy) return res.status(404).json({ message: 'Privacy Policy not found' });
        res.status(200).json({ message: 'Privacy Policy deleted successfully', deletedPrivacyPolicy });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete Privacy Policy', error: error.message });
    }
}; 