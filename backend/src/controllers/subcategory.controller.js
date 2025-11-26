const Subcategory = require("../models/subcategory.model");
const Category = require("../models/category.model");
const asyncHandler = require("../utils/asyncHandler.util");
const { successResponse } = require("../utils/response.util");
const ApiError = require("../utils/apiError.util");

/**
 * Get subcategories by category
 * GET /api/v1/categories/:categoryId/subcategories
 */
const getSubcategoriesByCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;

    const subcategories = await Subcategory.find({
        category: categoryId,
        isActive: true,
    })
        .sort({ order: 1 })
        .select("name slug order");

    return successResponse(
        res,
        subcategories,
        "서브카테고리 목록을 성공적으로 조회했습니다"
    );
});

/**
 * Get all subcategories (Admin)
 * GET /api/v1/admin/subcategories
 */
const getAllSubcategories = asyncHandler(async (req, res) => {
    const subcategories = await Subcategory.find()
        .populate("category", "title slug")
        .sort({ category: 1, order: 1 });

    return successResponse(
        res,
        subcategories,
        "전체 서브카테고리 목록을 성공적으로 조회했습니다"
    );
});

/**
 * Create subcategory (Admin)
 * POST /api/v1/admin/subcategories
 */
const createSubcategory = asyncHandler(async (req, res) => {
    const { name, categoryId, order } = req.body;

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

    return successResponse(
        res,
        subcategory,
        "서브카테고리가 성공적으로 생성되었습니다",
        201
    );
});

/**
 * Update subcategory (Admin)
 * PUT /api/v1/admin/subcategories/:id
 */
const updateSubcategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, order, isActive } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;

    const subcategory = await Subcategory.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });

    if (!subcategory) {
        throw ApiError.notFound("서브카테고리를 찾을 수 없습니다");
    }

    return successResponse(
        res,
        subcategory,
        "서브카테고리가 성공적으로 업데이트되었습니다"
    );
});

/**
 * Delete subcategory (Admin)
 * DELETE /api/v1/admin/subcategories/:id
 */
const deleteSubcategory = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const subcategory = await Subcategory.findByIdAndDelete(id);

    if (!subcategory) {
        throw ApiError.notFound("서브카테고리를 찾을 수 없습니다");
    }

    return successResponse(
        res,
        { message: "서브카테고리가 성공적으로 삭제되었습니다" },
        "서브카테고리가 성공적으로 삭제되었습니다"
    );
});

module.exports = {
    getSubcategoriesByCategory,
    getAllSubcategories,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
};
