const Product = require("../models/product.model");
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

    // Public routes should only see published products
    if (query.publicOnly) {
        filter.isPublished = true;
    }

    if (query.category) {
        filter.category = query.category;
    }

    if (query.isFeatured !== undefined) {
        filter.isFeatured = query.isFeatured === "true";
    }

    if (query.inStock !== undefined) {
        if (query.inStock === "true") {
            filter["stock.quantity"] = { $gt: 0 };
        }
    }

    if (query.search) {
        filter.$text = { $search: query.search };
    }

    // Price range filter
    if (query.minPrice || query.maxPrice) {
        filter.price = {};
        if (query.minPrice) filter.price.$gte = parseFloat(query.minPrice);
        if (query.maxPrice) filter.price.$lte = parseFloat(query.maxPrice);
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
 * Get product by ID or slug
 */
const getProductById = async (identifier) => {
    let product;

    // Check if identifier is a valid ObjectId
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
        product = await Product.findById(identifier);
    } else {
        product = await Product.findOne({ slug: identifier });
    }

    if (!product) {
        throw new Error("Product not found");
    }

    // Increment view count
    product.viewCount += 1;
    await product.save();

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
 * Toggle product published status
 */
const togglePublishStatus = async (productId) => {
    const product = await Product.findById(productId);

    if (!product) {
        throw new Error("Product not found");
    }

    product.isPublished = !product.isPublished;
    await product.save();

    return product;
};

/**
 * Update product stock
 */
const updateStock = async (productId, quantity) => {
    const product = await Product.findById(productId);

    if (!product) {
        throw new Error("Product not found");
    }

    product.stock.quantity = quantity;
    await product.save();

    return product;
};

/**
 * Get featured products
 */
const getFeaturedProducts = async (limit = 6) => {
    const products = await Product.find({
        isPublished: true,
        isFeatured: true,
    })
        .sort({ salesCount: -1 })
        .limit(limit);

    return products;
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    togglePublishStatus,
    updateStock,
    getFeaturedProducts,
};
