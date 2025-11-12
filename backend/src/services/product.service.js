const Product = require("../models/product.model");
const ApiError = require("../utils/apiError.util");
const {
    getPaginationParams,
    createPaginationMeta,
} = require("../utils/pagination.util");

/**
 * Get all products with pagination and filters
 */
const getAllProducts = async (query) => {
    const { page, limit, skip } = getPaginationParams(query);

    const filter = {};

    // Public routes should only see active products
    if (query.publicOnly || query.isActive === "true") {
        filter.isActive = true;
    } else if (query.isActive === "false") {
        filter.isActive = false;
    }

    // Filter by category ID
    if (query.category) {
        filter["category._id"] = query.category;
    }

    // Filter by in stock
    if (query.inStock !== undefined) {
        if (query.inStock === "true") {
            filter.availableQuantity = { $gt: 0 };
        }
    }

    // Text search
    if (query.search) {
        filter.$text = { $search: query.search };
    }

    // Price range filter (using finalPrice)
    if (query.minPrice || query.maxPrice) {
        filter.finalPrice = {};
        if (query.minPrice) filter.finalPrice.$gte = parseFloat(query.minPrice);
        if (query.maxPrice) filter.finalPrice.$lte = parseFloat(query.maxPrice);
    }

    const sortBy = query.sortBy || "createdAt";
    const sortOrder = query.sortOrder === "asc" ? 1 : -1;

    const products = await Product.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit);

    const total = await Product.countDocuments(filter);

    return {
        products,
        pagination: createPaginationMeta(page, limit, total),
    };
};

/**
 * Get product by ID
 */
const getProductById = async (productId, options = {}) => {
    const product = await Product.findById(productId);

    if (!product) {
        throw ApiError.notFound("Product not found");
    }

    // For public routes, check if product is active
    if (options.publicOnly && !product.isActive) {
        throw ApiError.notFound("Product not found");
    }

    return product;
};

/**
 * Create a new product
 */
const createProduct = async (productData) => {
    const product = await Product.create(productData);
    return product;
};

/**
 * Update product
 */
const updateProduct = async (productId, updates) => {
    const product = await Product.findByIdAndUpdate(productId, updates, {
        new: true,
        runValidators: true,
    });

    if (!product) {
        throw new Error("Product not found");
    }

    return product;
};

/**
 * Delete product
 */
const deleteProduct = async (productId) => {
    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
        throw new Error("Product not found");
    }

    return { message: "Product deleted successfully" };
};

/**
 * Toggle product active status
 */
const toggleActiveStatus = async (productId) => {
    const product = await Product.findById(productId);

    if (!product) {
        throw ApiError.notFound("Product not found");
    }

    product.isActive = !product.isActive;
    await product.save();

    return product;
};

/**
 * Update product stock
 */
const updateStock = async (productId, availableQuantity) => {
    const product = await Product.findById(productId);

    if (!product) {
        throw ApiError.notFound("Product not found");
    }

    product.availableQuantity = availableQuantity;
    await product.save();

    return product;
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleActiveStatus,
    updateStock,
};
