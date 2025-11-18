const productService = require("../services/product.service");
const searchService = require("../services/search.service");
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

        // Log search if search query is present
        if (req.query.search) {
            searchService.logSearch(
                {
                    keyword: req.query.search,
                    resultsCount: pagination.totalProducts || 0,
                    source: req.query.source || "other",
                    filters: {
                        category: req.query.category,
                        minPrice: req.query.minPrice,
                        maxPrice: req.query.maxPrice,
                        isActive: req.query.isActive,
                    },
                },
                req.user, // Will be undefined if not authenticated
                req
            );
        }

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
 * Toggle active status
 */
const toggleActive = async (req, res, next) => {
    try {
        const product = await productService.toggleActiveStatus(req.params.id);
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
        const { availableQuantity } = req.body;
        const product = await productService.updateStock(
            req.params.id,
            availableQuantity
        );
        return successResponse(res, product, "Stock updated successfully");
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
    toggleActive,
    updateStock,
};
