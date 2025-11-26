const Subcategory = require("../models/subcategory.model");
const Category = require("../models/category.model");
const ApiError = require("../utils/apiError.util");

const getSubcategoriesByCategory = async (categoryId) => {
    const subcategories = await Subcategory.find({
        category: categoryId,
        isActive: true,
    })
        .sort({ order: 1 })
        .select("name slug order");

    return subcategories;
};

const getAllSubcategories = async () => {
    const subcategories = await Subcategory.find()
        .populate("category", "title slug")
        .sort({ category: 1, order: 1 });

    return subcategories;
};

const createSubcategory = async (data) => {
    const { name, categoryId, order } = data;

    // Validate category exists
    const category = await Category.findById(categoryId);
    if (!category) {
        throw ApiError.notFound("카테고리를 찾을 수 없습니다");
    }

    // Create slug from name
    const slug = name
        .toLowerCase()
        .replace(/\//g, "-")
        .replace(/\(/g, "")
        .replace(/\)/g, "")
        .replace(/\s+/g, "-")
        .replace(/[^\w\-가-힣]/g, "");

    const subcategory = await Subcategory.create({
        name,
        slug,
        category: categoryId,
        order: order || 0,
        isActive: true,
    });

    return subcategory;
};

const updateSubcategory = async (id, updates) => {
    const subcategory = await Subcategory.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
    });

    if (!subcategory) {
        throw ApiError.notFound("서브카테고리를 찾을 수 없습니다");
    }

    return subcategory;
};

const deleteSubcategory = async (id) => {
    const subcategory = await Subcategory.findByIdAndDelete(id);

    if (!subcategory) {
        throw ApiError.notFound("서브카테고리를 찾을 수 없습니다");
    }

    return { message: "서브카테고리가 성공적으로 삭제되었습니다" };
};

const validateSubcategoryBelongsToCategory = async (
    subcategoryId,
    categoryId
) => {
    const subcategory = await Subcategory.findById(subcategoryId);

    if (!subcategory) {
        throw ApiError.notFound("서브카테고리를 찾을 수 없습니다");
    }

    if (subcategory.category.toString() !== categoryId.toString()) {
        throw ApiError.badRequest(
            "선택한 서브카테고리가 해당 카테고리에 속하지 않습니다"
        );
    }

    return true;
};

module.exports = {
    getSubcategoriesByCategory,
    getAllSubcategories,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
    validateSubcategoryBelongsToCategory,
};
