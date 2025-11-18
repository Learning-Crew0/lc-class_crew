/**
 * Category & Position Controller
 * Handles HTTP requests for categories and positions
 */

const categoryService = require("../services/category.service");
const Category = require("../models/category.model");
const asyncHandler = require("../utils/asyncHandler.util");
const { successResponse } = require("../utils/response.util");
const ApiError = require("../utils/apiError.util");

/**
 * Get all categories (MongoDB)
 * GET /api/v1/categories
 */
const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({ isActive: true }).sort({ order: 1 });

    return successResponse(
        res,
        { categories },
        "Categories retrieved successfully"
    );
});

/**
 * Get category by ID (MongoDB)
 * GET /api/v1/categories/:id
 */
const getCategoryById = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        throw ApiError.notFound("Category not found");
    }

    return successResponse(
        res,
        { category },
        "Category retrieved successfully"
    );
});

/**
 * Get category with courses (MongoDB)
 * GET /api/v1/categories/:id/courses
 */
const getCategoryWithCourses = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id).populate("courses");

    if (!category) {
        throw ApiError.notFound("Category not found");
    }

    return successResponse(
        res,
        { category },
        "Category with courses retrieved successfully"
    );
});

/**
 * Create new category (Admin only)
 * POST /api/v1/categories
 */
const createCategory = asyncHandler(async (req, res) => {
    const { title, description, parentCategory, level, order, icon, isActive } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({ title });
    if (existingCategory) {
        throw ApiError.badRequest("Category with this title already exists");
    }

    const category = await Category.create({
        title,
        description,
        parentCategory,
        level,
        order,
        icon,
        isActive,
    });

    return successResponse(
        res,
        { category },
        "Category created successfully",
        201
    );
});

/**
 * Update category (Admin only)
 * PUT /api/v1/categories/:id
 */
const updateCategory = asyncHandler(async (req, res) => {
    const { title, description, parentCategory, level, order, icon, isActive } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) {
        throw ApiError.notFound("Category not found");
    }

    // Check if title is being changed and already exists
    if (title && title !== category.title) {
        const existingCategory = await Category.findOne({ title });
        if (existingCategory) {
            throw ApiError.badRequest("Category with this title already exists");
        }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        { title, description, parentCategory, level, order, icon, isActive },
        { new: true, runValidators: true }
    );

    return successResponse(
        res,
        { category: updatedCategory },
        "Category updated successfully"
    );
});

/**
 * Delete category (Admin only)
 * DELETE /api/v1/categories/:id
 */
const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        throw ApiError.notFound("Category not found");
    }

    // Check if category has courses
    if (category.courseCount > 0) {
        throw ApiError.badRequest(
            "Cannot delete category with associated courses"
        );
    }

    await Category.findByIdAndDelete(req.params.id);

    return successResponse(res, null, "Category deleted successfully");
});

/**
 * Get all positions
 * GET /api/v1/positions
 */
const getAllPositions = asyncHandler(async (req, res) => {
    const positions = await categoryService.getAllPositions();

    return successResponse(
        res,
        { positions },
        "Positions retrieved successfully"
    );
});

/**
 * Get category by slug
 * GET /api/v1/categories/:slug
 */
const getCategoryBySlug = asyncHandler(async (req, res) => {
    const category = await categoryService.getCategoryBySlug(req.params.slug);

    if (!category) {
        return successResponse(res, null, "Category not found", 404);
    }

    return successResponse(
        res,
        { category },
        "Category retrieved successfully"
    );
});

/**
 * Get position by slug
 * GET /api/v1/positions/:slug
 */
const getPositionBySlug = asyncHandler(async (req, res) => {
    const position = await categoryService.getPositionBySlug(req.params.slug);

    if (!position) {
        return successResponse(res, null, "Position not found", 404);
    }

    return successResponse(
        res,
        { position },
        "Position retrieved successfully"
    );
});

module.exports = {
    getAllCategories,
    getCategoryById,
    getCategoryWithCourses,
    createCategory,
    updateCategory,
    deleteCategory,
    getAllPositions,
    getCategoryBySlug,
    getPositionBySlug,
};
