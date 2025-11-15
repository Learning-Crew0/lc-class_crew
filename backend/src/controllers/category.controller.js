/**
 * Category & Position Controller
 * Handles HTTP requests for categories and positions
 */

const categoryService = require("../services/category.service");
const asyncHandler = require("../utils/asyncHandler.util");
const { successResponse } = require("../utils/response.util");

/**
 * Get all categories
 * GET /api/v1/categories
 */
const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await categoryService.getAllCategories();

    return successResponse(
        res,
        { categories },
        "Categories retrieved successfully"
    );
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
    getAllPositions,
    getCategoryBySlug,
    getPositionBySlug,
};
