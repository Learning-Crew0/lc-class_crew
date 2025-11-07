const faqService = require("../services/faq.service");
const asyncHandler = require("../utils/asyncHandler.util");
const ApiError = require("../utils/apiError.util");
const { successResponse } = require("../utils/response.util");

const createFAQCategory = asyncHandler(async (req, res) => {
    const category = await faqService.createFAQCategory(req.body);
    return successResponse(res, category, "Category created successfully", 201);
});

const getAllFAQCategories = asyncHandler(async (req, res) => {
    const categories = await faqService.getAllFAQCategories(req.query);
    return successResponse(res, categories, "Categories retrieved successfully");
});

const getFAQCategoryById = asyncHandler(async (req, res) => {
    const category = await faqService.getFAQCategoryById(req.params.id);
    return successResponse(res, category, "Category retrieved successfully");
});

const updateFAQCategory = asyncHandler(async (req, res) => {
    const category = await faqService.updateFAQCategory(
        req.params.id,
        req.body
    );
    return successResponse(res, category, "Category updated successfully");
});

const deleteFAQCategory = asyncHandler(async (req, res) => {
    const result = await faqService.deleteFAQCategory(req.params.id);
    return successResponse(res, result, result.message);
});

const createFAQ = asyncHandler(async (req, res) => {
    if (!req.user || !req.user.id) {
        throw ApiError.unauthorized("Authentication required");
    }
    
    const faq = await faqService.createFAQ(req.body, req.user.id);
    return successResponse(res, faq, "FAQ created successfully", 201);
});

const getAllFAQs = asyncHandler(async (req, res) => {
    const result = await faqService.getAllFAQs(req.query);
    return successResponse(res, result, "FAQs retrieved successfully");
});

const getFAQById = asyncHandler(async (req, res) => {
    const incrementView = !req.user || req.user.role !== "admin";
    const faq = await faqService.getFAQById(req.params.id, incrementView);
    return successResponse(res, faq, "FAQ retrieved successfully");
});

const getFAQsByCategory = asyncHandler(async (req, res) => {
    const result = await faqService.getFAQsByCategory(
        req.params.categoryKey,
        req.query
    );
    return successResponse(res, result, "FAQs retrieved successfully");
});

const updateFAQ = asyncHandler(async (req, res) => {
    if (!req.user || !req.user.id) {
        throw ApiError.unauthorized("Authentication required");
    }
    
    const faq = await faqService.updateFAQ(
        req.params.id,
        req.body,
        req.user.id
    );
    return successResponse(res, faq, "FAQ updated successfully");
});

const deleteFAQ = asyncHandler(async (req, res) => {
    const result = await faqService.deleteFAQ(req.params.id);
    return successResponse(res, result, result.message);
});

const markHelpful = asyncHandler(async (req, res) => {
    const result = await faqService.markHelpful(
        req.params.id,
        req.body.helpful
    );
    return successResponse(res, result, result.message);
});

const bulkDeleteFAQs = asyncHandler(async (req, res) => {
    const result = await faqService.bulkDeleteFAQs(req.body.ids);
    return successResponse(res, result, result.message);
});

const getFAQStats = asyncHandler(async (req, res) => {
    const stats = await faqService.getFAQStats();
    return successResponse(res, stats, "Statistics retrieved successfully");
});

module.exports = {
    createFAQCategory,
    getAllFAQCategories,
    getFAQCategoryById,
    updateFAQCategory,
    deleteFAQCategory,
    createFAQ,
    getAllFAQs,
    getFAQById,
    getFAQsByCategory,
    updateFAQ,
    deleteFAQ,
    markHelpful,
    bulkDeleteFAQs,
    getFAQStats,
};

