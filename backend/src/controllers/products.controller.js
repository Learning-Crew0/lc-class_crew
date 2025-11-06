const productService = require("../services/product.service");
const {
    successResponse,
    paginatedResponse,
} = require("../utils/response.util");

/**
 * Get all products
 */
const getAllProducts = async (req, res, next) => {
    try {
        const { products, pagination } = await productService.getAllProducts(
            req.query
        );
        return paginatedResponse(
            res,
            products,
            pagination,
            "Products retrieved successfully"
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Get product by ID or slug
 */
const getProductById = async (req, res, next) => {
    try {
        const product = await productService.getProductById(req.params.id);
        return successResponse(res, product, "Product retrieved successfully");
    } catch (error) {
        next(error);
    }
};

/**
 * Create product
 */
const createProduct = async (req, res, next) => {
    try {
        const product = await productService.createProduct(req.body);
        return successResponse(
            res,
            product,
            "Product created successfully",
            201
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Update product
 */
const updateProduct = async (req, res, next) => {
    try {
        const product = await productService.updateProduct(
            req.params.id,
            req.body
        );
        return successResponse(res, product, "Product updated successfully");
    } catch (error) {
        next(error);
    }
};

/**
 * Delete product
 */
const deleteProduct = async (req, res, next) => {
    try {
        const result = await productService.deleteProduct(req.params.id);
        return successResponse(res, result, "Product deleted successfully");
    } catch (error) {
        next(error);
    }
};

/**
 * Toggle publish status
 */
const togglePublish = async (req, res, next) => {
    try {
        const product = await productService.togglePublishStatus(req.params.id);
        return successResponse(
            res,
            product,
            "Product status updated successfully"
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Update stock
 */
const updateStock = async (req, res, next) => {
    try {
        const { quantity } = req.body;
        const product = await productService.updateStock(
            req.params.id,
            quantity
        );
        return successResponse(res, product, "Stock updated successfully");
    } catch (error) {
        next(error);
    }
};

/**
 * Get featured products
 */
const getFeatured = async (req, res, next) => {
    try {
        const products = await productService.getFeaturedProducts(
            req.query.limit
        );
        return successResponse(
            res,
            products,
            "Featured products retrieved successfully"
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    togglePublish,
    updateStock,
    getFeatured,
};
