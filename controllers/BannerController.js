import BannerModel from '../models/BannerModel.js';
import cloudinary from '../cloudinaryConfig/cloudinaryConfig.js';

export const createBanner = async (req, res) => {
    const { type, redirectId, redirectModel } = req.body;
    const imageFile = req.file.buffer; // Use buffer for the uploaded image

    try {
        // Upload image to Cloudinary
        const stream = cloudinary.v2.uploader.upload_stream({
            folder: 'banner_images',
            public_id: `banner_${Date.now()}`,
            overwrite: true,
        }, async (error, result) => {
            if (error) {
                console.error('Cloudinary upload error:', error);
                return res.status(500).json({ status: 'failed', message: 'Image upload failed' });
            }

            // Save banner details in the database
            const banner = await BannerModel.create({
                type,
                url: result.secure_url, // Save the Cloudinary URL
                redirectId,
                redirectModel,
            });

            res.status(201).json({ message: 'Banner created successfully', banner });
        });

        stream.end(imageFile); // End the stream with the image buffer
    } catch (error) {
        console.error('Failed to create banner:', error);
        res.status(500).json({ message: 'Failed to create banner', error });
    }
};

export const updateBanner = async (req, res) => {
    const { id } = req.params;
    const { ...updatedBanner } = req.body;
    const imageFile = req.file?.buffer; // Handle case where image might not be provided

    try {
        // Find the banner to update
        const banner = await BannerModel.findById(id);
        if (!banner) {
            return res.status(404).json({ message: 'Banner not found' });
        }

        // Prepare fields to update
        const updateFields = { ...updatedBanner };

        if (imageFile) {
            // Upload new image to Cloudinary
            const stream = cloudinary.v2.uploader.upload_stream({
                folder: 'banner_images',
                public_id: `banner_${id}`,
                overwrite: true,
            }, async (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    return res.status(500).json({ status: 'failed', message: 'Image upload failed' });
                }

                // Update the image URL
                updateFields.url = result?.secure_url;

                // Update the banner in the database
                const updatedBanner = await BannerModel.findByIdAndUpdate(id, updateFields, { new: true });

                res.status(200).json({ message: 'Banner updated successfully', updatedBanner });
            });

            stream.end(imageFile); // End the stream with the image buffer
        } else {
            // Update the banner in the database
            const updatedBanner = await BannerModel.findByIdAndUpdate(id, updateFields, { new: true });

            res.status(200).json({ message: 'Banner updated successfully', updatedBanner });
        }
    } catch (error) {
        console.error('Failed to update banner:', error);
        res.status(500).json({ message: 'Failed to update banner', error: error.message });
    }
};

export const getBannerById = async (req, res) => {
    const { id } = req.params;
    try {
        const banner = await BannerModel.findById(id);
        if (!banner) {
            return res.status(404).json({ message: 'Banner not found' });
        }
        res.status(200).json({ message: 'Banner found successfully', banner });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get banner', error: error.message });
    }
};

export const getAllBanners = async (req, res) => {
    try {
        const banners = await BannerModel.find();
        res.status(200).json({ message: 'Banners found successfully', banners });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get banners', error: error.message });
    }
};

export const getBanners = async (req, res) => {
    const { testSeriesId } = req.params; // ID of the test series to fetch related banners

    try {
        // Fetch banners related to the test series
        const testSeriesBanners = await BannerModel.find({
            type: 'test-series',
            redirectId: testSeriesId,
        });

        // Fetch all subscription banners
        const subscriptionBanners = await BannerModel.find({
            type: 'subscription',
        });

        const banners = [...testSeriesBanners, ...subscriptionBanners];

        res.status(200).json({
            message: 'Banners fetched successfully',
            banners,
        });
    } catch (error) {
        console.error('Failed to fetch banners:', error);
        res.status(500).json({
            message: 'Failed to fetch banners',
            error: error.message,
        });
    }
};

export const deleteBanner = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedBanner = await BannerModel.findByIdAndDelete(id);
        if (!deletedBanner) {
            return res.status(404).json({ message: 'Banner not found' });
        }
        res.status(200).json({ message: 'Banner deleted successfully', deletedBanner });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete banner', error: error.message });
    }
};
