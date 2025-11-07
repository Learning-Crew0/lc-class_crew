const Category = require("../models/category.model");
const ApiError = require("../utils/apiError.util");
const { getPaginationParams, createPaginationMeta } = require("../utils/pagination.util");

const getAllCategories = async (query) => {
    const { page, limit, skip } = getPaginationParams(query);
    const filter = {};

    if (query.isActive !== undefined) {
        filter.isActive = query.isActive === "true";
    }

    if (query.level) {
        filter.level = parseInt(query.level);
    }

    if (query.parentCategory) {
        filter.parentCategory = query.parentCategory;
    }

    const categories = await Category.find(filter)
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Category.countDocuments(filter);

    return {
        categories,
        pagination: createPaginationMeta(page, limit, total),
    };
};

const getCategoryById = async (categoryId) => {
    const category = await Category.findById(categoryId);
    if (!category) {
        throw ApiError.notFound("카테고리를 찾을 수 없습니다");
    }
    return category;
};

const getCategoryWithCourses = async (categoryId) => {
    const category = await Category.findById(categoryId).populate({
        path: "courses",
        match: { isActive: true },
        select: "title mainImage price tagText tags",
    });
    
    if (!category) {
        throw ApiError.notFound("카테고리를 찾을 수 없습니다");
    }
    
    return category;
};

const createCategory = async (categoryData) => {
    const existingCategory = await Category.findOne({ title: categoryData.title });
    if (existingCategory) {
        throw ApiError.conflict("이미 존재하는 카테고리 제목입니다");
    }

    const category = await Category.create(categoryData);
    return category;
};

const updateCategory = async (categoryId, updates) => {
    if (updates.title) {
        const existingCategory = await Category.findOne({
            title: updates.title,
            _id: { $ne: categoryId },
        });
        if (existingCategory) {
            throw ApiError.conflict("이미 존재하는 카테고리 제목입니다");
        }
    }

    const category = await Category.findByIdAndUpdate(categoryId, updates, {
        new: true,
        runValidators: true,
    });

    if (!category) {
        throw ApiError.notFound("카테고리를 찾을 수 없습니다");
    }

    return category;
};

const deleteCategory = async (categoryId) => {
    const category = await Category.findById(categoryId);
    if (!category) {
        throw ApiError.notFound("카테고리를 찾을 수 없습니다");
    }

    if (category.courseCount > 0) {
        throw ApiError.badRequest("코스가 있는 카테고리는 삭제할 수 없습니다");
    }

    await Category.findByIdAndDelete(categoryId);
    return { message: "카테고리가 성공적으로 삭제되었습니다" };
};

module.exports = {
    getAllCategories,
    getCategoryById,
    getCategoryWithCourses,
    createCategory,
    updateCategory,
    deleteCategory,
};

