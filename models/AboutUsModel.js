import mongoose from "mongoose";

const AboutUsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const AboutUsModel = mongoose.model('AboutUs', AboutUsSchema); 

export default AboutUsModel;
