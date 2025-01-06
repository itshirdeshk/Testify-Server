import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the schema for the banner
const BannerSchema = new Schema({
    type: {
        type: String,
        enum: ['test-series', 'subscription', 'custom'], // Add 'custom' for additional use cases
        required: true,
    },
    url: {
        type: String,
        required: true, // URL for the banner image
    },
    redirectId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'redirectModel', // Dynamically reference the model based on the type
    },
    redirectModel: {
        type: String,
        enum: ['TestSeries', 'Subscription'], // Models to reference for navigation
    }
}, { timestamps: true });

// Create a model using the schema
const BannerModel = mongoose.model('Banner', BannerSchema);

export default BannerModel;
