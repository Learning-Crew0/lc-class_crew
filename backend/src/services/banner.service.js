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

module.exports = {
    getAllBanners,
    getBannerById,
    createBanner,
    updateBanner,
    deleteBanner,
    toggleActiveStatus,
    trackImpression,
    trackClick,
};
