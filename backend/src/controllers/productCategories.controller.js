const productCategoryService = require("../services/productCategory.service");
const { successResponse } = require("../utils/response.util");

/**
 * Get all categories
 */
const getAllCategories = async (req, res, next) => {
    try {
        const categories = await productCategoryService.getAllCategories(
            req.query
        );
        return successResponse(
            res,
            categories,
            "Categories retrieved successfully"
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Get category by ID or slug
 */
const getCategoryById = async (req, res, next) => {
    try {
        const options = req.publicOnly ? { publicOnly: true } : {};
        const category = await productCategoryService.getCategoryById(
            req.params.id,
            options
        );
        return successResponse(
            res,
            category,
            "Category retrieved successfully"
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Create category
 */
const createCategory = async (req, res, next) => {
    try {
        const category = await productCategoryService.createCategory(req.body);
        return successResponse(
            res,
            category,
            "Category created successfully",
            201
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Update category
 */
const updateCategory = async (req, res, next) => {
    try {
        const category = await productCategoryService.updateCategory(
            req.params.id,
            req.body
        );
        return successResponse(res, category, "Category updated successfully");
    } catch (error) {
        next(error);
    }
};

/**
 * Delete category
 */
const deleteCategory = async (req, res, next) => {
    try {
        const result = await productCategoryService.deleteCategory(
            req.params.id
        );
        return successResponse(res, result, "Category deleted successfully");
    } catch (error) {
        next(error);
    }
};

/**
 * Toggle active status
 */
const toggleActive = async (req, res, next) => {
    try {
        const category = await productCategoryService.toggleActiveStatus(
            req.params.id
        );
        return successResponse(
            res,
            category,
            "Category status updated successfully"
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Update product counts
 */
const updateProductCounts = async (req, res, next) => {
    try {
        const result = await productCategoryService.updateProductCounts();
        return successResponse(
            res,
            result,
            "Product counts updated successfully"
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleActive,
    updateProductCounts,
};
