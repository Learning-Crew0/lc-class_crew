const FAQ = require("../models/faq.model");
const {
    getPaginationParams,
    createPaginationMeta,
} = require("../utils/pagination.util");

/**
 * Get all FAQs with filters
 */
const getAllFAQs = async (query) => {
    const { page, limit, skip } = getPaginationParams(query);

    const filter = {};

    // For public access, only show published FAQs
    if (query.publicOnly) {
        filter.isPublished = true;
    }

    if (query.category) {
        filter.category = query.category;
    }

    if (query.search) {
        filter.$text = { $search: query.search };
    }

    const faqs = await FAQ.find(filter)
        .sort({ category: 1, order: 1 })
        .skip(skip)
        .limit(limit);

    const total = await FAQ.countDocuments(filter);

    return {
        faqs,
        pagination: createPaginationMeta(page, limit, total),
    };
};

/**
 * Get FAQ by ID
 */
const getFAQById = async (faqId) => {
    const faq = await FAQ.findById(faqId);

    if (!faq) {
        throw new Error("FAQ not found");
    }

    // Increment views
    faq.views += 1;
    await faq.save();

    return faq;
};

/**
 * Create FAQ
 */
const createFAQ = async (faqData) => {
    const faq = await FAQ.create(faqData);
    return faq;
};

/**
 * Update FAQ
 */
const updateFAQ = async (faqId, updates) => {
    const faq = await FAQ.findByIdAndUpdate(faqId, updates, {
        new: true,
        runValidators: true,
    });

    if (!faq) {
        throw new Error("FAQ not found");
    }

    return faq;
};

/**
 * Delete FAQ
 */
const deleteFAQ = async (faqId) => {
    const faq = await FAQ.findByIdAndDelete(faqId);

    if (!faq) {
        throw new Error("FAQ not found");
    }

    return { message: "FAQ deleted successfully" };
};

/**
 * Toggle publish status
 */
const togglePublishStatus = async (faqId) => {
    const faq = await FAQ.findById(faqId);

    if (!faq) {
        throw new Error("FAQ not found");
    }

    faq.isPublished = !faq.isPublished;
    await faq.save();

    return faq;
};

/**
 * Mark FAQ as helpful/not helpful
 */
const markHelpful = async (faqId, isHelpful) => {
    const faq = await FAQ.findById(faqId);

    if (!faq) {
        throw new Error("FAQ not found");
    }

    if (isHelpful) {
        faq.helpful += 1;
    } else {
        faq.notHelpful += 1;
    }

    await faq.save();

    return faq;
};

/**
 * Get FAQs by category
 */
const getFAQsByCategory = async (category) => {
    const faqs = await FAQ.find({
        category,
        isPublished: true,
    }).sort({ order: 1 });

    return faqs;
};

module.exports = {
    getAllFAQs,
    getFAQById,
    createFAQ,
    updateFAQ,
    deleteFAQ,
    togglePublishStatus,
    markHelpful,
    getFAQsByCategory,
};
