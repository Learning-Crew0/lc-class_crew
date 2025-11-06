const faqService = require("../services/faq.service");
const {
  successResponse,
  paginatedResponse,
} = require("../utils/response.util");

/**
 * Get all FAQs
 */
const getAllFAQs = async (req, res, next) => {
  try {
    const { faqs, pagination } = await faqService.getAllFAQs(req.query);
    return paginatedResponse(
      res,
      faqs,
      pagination,
      "FAQs retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get FAQ by ID
 */
const getFAQById = async (req, res, next) => {
  try {
    const faq = await faqService.getFAQById(req.params.id);
    return successResponse(res, faq, "FAQ retrieved successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Create FAQ
 */
const createFAQ = async (req, res, next) => {
  try {
    const faq = await faqService.createFAQ(req.body);
    return successResponse(res, faq, "FAQ created successfully", 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Update FAQ
 */
const updateFAQ = async (req, res, next) => {
  try {
    const faq = await faqService.updateFAQ(req.params.id, req.body);
    return successResponse(res, faq, "FAQ updated successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Delete FAQ
 */
const deleteFAQ = async (req, res, next) => {
  try {
    const result = await faqService.deleteFAQ(req.params.id);
    return successResponse(res, result, "FAQ deleted successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle publish status
 */
const togglePublish = async (req, res, next) => {
  try {
    const faq = await faqService.togglePublishStatus(req.params.id);
    return successResponse(res, faq, "FAQ status updated successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Mark FAQ as helpful
 */
const markHelpful = async (req, res, next) => {
  try {
    const { helpful } = req.body;
    const faq = await faqService.markHelpful(req.params.id, helpful);
    return successResponse(res, faq, "Feedback recorded successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Get FAQs by category
 */
const getByCategory = async (req, res, next) => {
  try {
    const faqs = await faqService.getFAQsByCategory(req.params.category);
    return successResponse(res, faqs, "FAQs retrieved successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllFAQs,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  togglePublish,
  markHelpful,
  getByCategory,
};
