const bannerService = require("../services/banner.service");
const {
  successResponse,
  paginatedResponse,
} = require("../utils/response.util");

/**
 * Get all banners
 */
const getAllBanners = async (req, res, next) => {
  try {
    const { banners, pagination } = await bannerService.getAllBanners(
      req.query
    );
    return paginatedResponse(
      res,
      banners,
      pagination,
      "Banners retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get banner by ID
 */
const getBannerById = async (req, res, next) => {
  try {
    const banner = await bannerService.getBannerById(req.params.id);
    return successResponse(res, banner, "Banner retrieved successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Create banner
 */
const createBanner = async (req, res, next) => {
  try {
    const banner = await bannerService.createBanner(req.body);
    return successResponse(res, banner, "Banner created successfully", 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Update banner
 */
const updateBanner = async (req, res, next) => {
  try {
    const banner = await bannerService.updateBanner(req.params.id, req.body);
    return successResponse(res, banner, "Banner updated successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Delete banner
 */
const deleteBanner = async (req, res, next) => {
  try {
    const result = await bannerService.deleteBanner(req.params.id);
    return successResponse(res, result, "Banner deleted successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle active status
 */
const toggleActive = async (req, res, next) => {
  try {
    const banner = await bannerService.toggleActiveStatus(req.params.id);
    return successResponse(res, banner, "Banner status updated successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Track banner impression
 */
const trackImpression = async (req, res, next) => {
  try {
    const banner = await bannerService.trackImpression(req.params.id);
    return successResponse(res, banner, "Impression tracked successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Track banner click
 */
const trackClick = async (req, res, next) => {
  try {
    const banner = await bannerService.trackClick(req.params.id);
    return successResponse(res, banner, "Click tracked successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleActive,
  trackImpression,
  trackClick,
};
