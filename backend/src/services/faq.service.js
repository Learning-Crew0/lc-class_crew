const FAQ = require("../models/faq.model");
const FAQCategory = require("../models/faqCategory.model");
const ApiError = require("../utils/apiError.util");

const normalizeData = (data) => {
    const normalized = { ...data };

    if (typeof normalized.tags === "string") {
        normalized.tags = normalized.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean);
    }

    if (typeof normalized.relatedFAQs === "string") {
        normalized.relatedFAQs = normalized.relatedFAQs
            .split(",")
            .map((id) => id.trim())
            .filter(Boolean);
    }

    if (typeof normalized.relatedArticles === "string") {
        normalized.relatedArticles = normalized.relatedArticles
            .split(",")
            .map((url) => url.trim())
            .filter(Boolean);
    }

    return normalized;
};

const createFAQCategory = async (categoryData) => {
    const existingCategory = await FAQCategory.findOne({ key: categoryData.key });
    if (existingCategory) {
        throw ApiError.conflict(
            "Category with this key already exists"
        );
    }

    const category = new FAQCategory(categoryData);
    await category.save();

    return category;
};

const getAllFAQCategories = async (filters = {}) => {
    const { isActive } = filters;

    const query = {};

    if (isActive !== undefined) {
        query.isActive = isActive === "true" || isActive === true;
    }

    const categories = await FAQCategory.find(query).sort({ order: 1 });

    return categories;
};

const getFAQCategoryById = async (id) => {
    const category = await FAQCategory.findById(id);

    if (!category) {
        throw ApiError.notFound("Category not found");
    }

    return category;
};

const updateFAQCategory = async (id, categoryData) => {
    const category = await FAQCategory.findByIdAndUpdate(id, categoryData, {
        new: true,
        runValidators: true,
    });

    if (!category) {
        throw ApiError.notFound("Category not found");
    }

    return category;
};

const deleteFAQCategory = async (id) => {
    const category = await FAQCategory.findById(id);

    if (!category) {
        throw ApiError.notFound("Category not found");
    }

    const faqCount = await FAQ.countDocuments({ category: category.key });

    if (faqCount > 0) {
        throw ApiError.badRequest(
            `Cannot delete category with ${faqCount} FAQs. Delete FAQs first.`
        );
    }

    await category.deleteOne();

    return {
        message: "Category deleted successfully",
    };
};

const createFAQ = async (faqData, adminId) => {
    const normalized = normalizeData(faqData);

    const category = await FAQCategory.findOne({
        key: normalized.category,
    });

    if (!category) {
        throw ApiError.notFound("Category not found");
    }

    const faq = new FAQ({
        ...normalized,
        categoryLabel: category.label,
        createdBy: adminId,
    });

    await faq.save();

    category.faqCount += 1;
    await category.save();

    return faq;
};

const getAllFAQs = async (filters = {}) => {
    const {
        page = 1,
        limit = 20,
        category,
        search,
        isActive,
        isFeatured,
    } = filters;

    const query = {};

    if (category && category !== "all") {
        query.category = category;
    }

    if (isActive !== undefined) {
        query.isActive = isActive === "true" || isActive === true;
    }

    if (isFeatured !== undefined) {
        query.isFeatured = isFeatured === "true" || isFeatured === true;
    }

    if (search) {
        query.$or = [
            { question: { $regex: search, $options: "i" } },
            { answer: { $regex: search, $options: "i" } },
            { tags: { $in: [new RegExp(search, "i")] } },
        ];
    }

    const total = await FAQ.countDocuments(query);
    const faqs = await FAQ.find(query)
        .populate("relatedFAQs", "question")
        .sort({ isFeatured: -1, order: 1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    return {
        faqs,
        pagination: {
            currentPage: parseInt(page, 10),
            totalPages: Math.ceil(total / limit),
            totalFAQs: total,
            limit: parseInt(limit, 10),
        },
    };
};

const getFAQById = async (id, incrementView = false) => {
    const faq = await FAQ.findById(id)
        .populate("relatedFAQs", "question category")
        .populate("createdBy", "username fullName");

    if (!faq) {
        throw ApiError.notFound("FAQ not found");
    }

    if (incrementView) {
        faq.views += 1;
        await faq.save();
    }

    return faq;
};

const getFAQsByCategory = async (categoryKey, filters = {}) => {
    const { page = 1, limit = 20 } = filters;

    const category = await FAQCategory.findOne({ key: categoryKey });

    if (!category) {
        throw ApiError.notFound("Category not found");
    }

    const query = {
        category: categoryKey,
        // Removed isActive filter - show all FAQs
    };

    const total = await FAQ.countDocuments(query);
    const faqs = await FAQ.find(query)
        .sort({ order: 1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    return {
        category,
        faqs,
        pagination: {
            currentPage: parseInt(page, 10),
            totalPages: Math.ceil(total / limit),
            totalFAQs: total,
            limit: parseInt(limit, 10),
        },
    };
};

const updateFAQ = async (id, faqData, adminId) => {
    const faq = await FAQ.findById(id);

    if (!faq) {
        throw ApiError.notFound("FAQ not found");
    }

    const oldCategory = faq.category;
    const normalized = normalizeData(faqData);

    Object.keys(normalized).forEach((key) => {
        if (normalized[key] !== undefined) {
            faq[key] = normalized[key];
        }
    });

    if (normalized.category && normalized.category !== oldCategory) {
        const newCategory = await FAQCategory.findOne({
            key: normalized.category,
        });

        if (!newCategory) {
            throw ApiError.notFound("Category not found");
        }

        faq.categoryLabel = newCategory.label;

        const oldCat = await FAQCategory.findOne({ key: oldCategory });
        if (oldCat && oldCat.faqCount > 0) {
            oldCat.faqCount -= 1;
            await oldCat.save();
        }

        newCategory.faqCount += 1;
        await newCategory.save();
    }

    faq.lastModifiedBy = adminId;
    await faq.save();

    return faq;
};

const deleteFAQ = async (id) => {
    const faq = await FAQ.findById(id);

    if (!faq) {
        throw ApiError.notFound("FAQ not found");
    }

    const category = await FAQCategory.findOne({ key: faq.category });
    if (category && category.faqCount > 0) {
        category.faqCount -= 1;
        await category.save();
    }

    await faq.deleteOne();

    return {
        message: "FAQ deleted successfully",
    };
};

const markHelpful = async (id, helpful) => {
    const faq = await FAQ.findById(id);

    if (!faq) {
        throw ApiError.notFound("FAQ not found");
    }

    if (helpful) {
        faq.helpful += 1;
    } else {
        faq.notHelpful += 1;
    }

    await faq.save();

    return {
        message: "Feedback recorded successfully",
        helpful: faq.helpful,
        notHelpful: faq.notHelpful,
    };
};

const bulkDeleteFAQs = async (ids) => {
    const faqs = await FAQ.find({ _id: { $in: ids } });

    const categoryUpdates = {};
    faqs.forEach((faq) => {
        categoryUpdates[faq.category] =
            (categoryUpdates[faq.category] || 0) + 1;
    });

    for (const [categoryKey, count] of Object.entries(categoryUpdates)) {
        await FAQCategory.updateOne(
            { key: categoryKey },
            { $inc: { faqCount: -count } }
        );
    }

    const result = await FAQ.deleteMany({ _id: { $in: ids } });

    return {
        message: `${result.deletedCount} FAQs deleted successfully`,
        deletedCount: result.deletedCount,
    };
};

const getFAQStats = async () => {
    const total = await FAQ.countDocuments();
    const active = await FAQ.countDocuments({ isActive: true });
    const featured = await FAQ.countDocuments({ isFeatured: true });

    const categoryCounts = await FAQ.aggregate([
        {
            $group: {
                _id: "$category",
                count: { $sum: 1 },
            },
        },
    ]);

    const totalViews = await FAQ.aggregate([
        {
            $group: {
                _id: null,
                totalViews: { $sum: "$viewCount" },
            },
        },
    ]);

    const totalHelpful = await FAQ.aggregate([
        {
            $group: {
                _id: null,
                helpful: { $sum: "$helpfulCount" },
                notHelpful: { $sum: "$notHelpful" },
            },
        },
    ]);

    return {
        total,
        active,
        featured,
        categories: categoryCounts,
        totalViews: totalViews[0]?.totalViews || 0,
        feedback: {
            helpful: totalHelpful[0]?.helpful || 0,
            notHelpful: totalHelpful[0]?.notHelpful || 0,
        },
    };
};

/**
 * Search FAQs
 * @param {Object} query - { q, category, limit }
 * @returns {Object} Search results
 */
const searchFAQs = async (query) => {
    const { q, category, limit = 10 } = query;

    if (!q || q.trim().length === 0) {
        throw ApiError.badRequest("Search query is required");
    }

    const searchQuery = {
        $text: { $search: q },
        // Removed isActive filter - search all FAQs
    };

    if (category && category !== "all") {
        searchQuery.category = category;
    }

    const faqs = await FAQ.find(searchQuery, {
        score: { $meta: "textScore" },
    })
        .sort({ score: { $meta: "textScore" } })
        .limit(parseInt(limit, 10))
        .select("question answer category categoryLabel");

    return {
        results: faqs.map((faq) => ({
            _id: faq._id,
            question: faq.question,
            answer: faq.answer,
            category: faq.category,
            categoryLabel: faq.categoryLabel,
            relevanceScore: faq._doc.score ? Math.min(faq._doc.score / 10, 1) : 0,
        })),
        total: faqs.length,
        query: q,
    };
};

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
    searchFAQs,
};
