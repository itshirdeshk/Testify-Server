import mongoose from "mongoose";

const TermsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const TermsModel = mongoose.model('Terms', TermsSchema); 

export default TermsModel;