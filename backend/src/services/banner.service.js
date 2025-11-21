const Banner = require("../models/banner.model");
const {
    getPaginationParams,
    createPaginationMeta,
} = require("../utils/pagination.util");

/**
 * Get all banners with filters
 */
const getAllBanners = async (query) => {
    const { page, limit, skip } = getPaginationParams(query);

    const filter = {};

    // For public access, only show active and current banners
    if (query.publicOnly) {
        filter.isActive = true;
        const now = new Date();
        filter.$or = [
            { startDate: { $lte: now }, endDate: { $gte: now } },
            { startDate: { $exists: false }, endDate: { $exists: false } },
            { startDate: null, endDate: null },
        ];
    }

    if (query.position) {
        filter.position = query.position;
    }

    const banners = await Banner.find(filter)
        .sort({ position: 1, order: 1 })
        .skip(skip)
        .limit(limit);

    const total = await Banner.countDocuments(filter);

    return {
        banners,
        pagination: createPaginationMeta(page, limit, total),
    };
};

/**
 * Get banner by ID
 */
const getBannerById = async (bannerId) => {
    const banner = await Banner.findById(bannerId);

    if (!banner) {
        throw new Error("Banner not found");
    }

    return banner;
};

/**
 * Create banner
 */
const createBanner = async (bannerData) => {
    // If order is not provided, set it to the highest order + 1 for that position
    if (!bannerData.order && bannerData.order !== 0) {
        const highestOrderBanner = await Banner.findOne({
            position: bannerData.position || "home-hero",
        })
            .sort({ order: -1 })
            .limit(1);

        bannerData.order = highestOrderBanner ? highestOrderBanner.order + 1 : 0;
    }

    const banner = await Banner.create(bannerData);
    return banner;
};

/**
 * Update banner
 */
const updateBanner = async (bannerId, updates) => {
    const banner = await Banner.findByIdAndUpdate(bannerId, updates, {
        new: true,
        runValidators: true,
    });

    if (!banner) {
        throw new Error("Banner not found");
    }

    return banner;
};

/**
 * Delete banner
 */
const deleteBanner = async (bannerId) => {
    const banner = await Banner.findByIdAndDelete(bannerId);

    if (!banner) {
        throw new Error("Banner not found");
    }

    return { message: "Banner deleted successfully" };
};

/**
 * Toggle banner active status
 */
const toggleActiveStatus = async (bannerId) => {
    const banner = await Banner.findById(bannerId);

    if (!banner) {
        throw new Error("Banner not found");
    }

    banner.isActive = !banner.isActive;
    await banner.save();

    return banner;
};

/**
 * Track banner impression
 */
const trackImpression = async (bannerId) => {
    const banner = await Banner.findByIdAndUpdate(
        bannerId,
        { $inc: { impressions: 1 } },
        { new: true }
    );

    if (!banner) {
        throw new Error("Banner not found");
    }

    return banner;
};

/**
 * Track banner click
 */
const trackClick = async (bannerId) => {
    const banner = await Banner.findByIdAndUpdate(
        bannerId,
        { $inc: { clicks: 1 } },
        { new: true }
    );

    if (!banner) {
        throw new Error("Banner not found");
    }

    return banner;
};

/**
 * Reorder banners
 * @param {Array} bannerOrders - Array of { id, order } objects
 * @returns {Promise<Array>} - Updated banners
 */
const reorderBanners = async (bannerOrders) => {
    const updatePromises = bannerOrders.map(({ id, order }) =>
        Banner.findByIdAndUpdate(
            id,
            { order },
            { new: true, runValidators: true }
        )
    );

    const updatedBanners = await Promise.all(updatePromises);

    // Filter out any null results (banner not found)
    const validBanners = updatedBanners.filter((banner) => banner !== null);

    if (validBanners.length !== bannerOrders.length) {
        throw new Error("Some banners were not found");
    }

    return validBanners;
};

module.exports = {
    getAllBanners,
    getBannerById,
    createBanner,
    updateBanner,
    deleteBanner,
    toggleActiveStatus,
    trackImpression,
    trackClick,
    reorderBanners,
};
