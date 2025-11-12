const ProductCategory = require("../models/productCategory.model");
const Product = require("../models/product.model");
const ApiError = require("../utils/apiError.util");

/**
 * Get all categories
 */
const getAllCategories = async (query = {}) => {
    const filter = {};

    // Public routes should only see active categories
    if (query.publicOnly || query.isActive === "true") {
        filter.isActive = true;
    } else if (query.isActive === "false") {
        filter.isActive = false;
    }

    const sortBy = query.sortBy || "order";
    const sortOrder = query.sortOrder === "desc" ? -1 : 1;

    const categories = await ProductCategory.find(filter).sort({
        [sortBy]: sortOrder,
    });

    return categories;
};

/**
 * Get category by ID or slug
 */
const getCategoryById = async (identifier, options = {}) => {
    let category;

    // Check if identifier is a valid ObjectId
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
        category = await ProductCategory.findById(identifier);
    } else {
        category = await ProductCategory.findOne({ slug: identifier });
    }

    if (!category) {
        throw ApiError.notFound("Category not found");
    }

    // For public routes, check if category is active
    if (options.publicOnly && !category.isActive) {
        throw ApiError.notFound("Category not found");
    }

    return category;
};

/**
 * Create category
 */
const createCategory = async (categoryData) => {
    // Check if title already exists
    const existing = await ProductCategory.findOne({
        title: categoryData.title,
    });

    if (existing) {
        throw ApiError.conflict("Category with this title already exists");
    }

    const category = await ProductCategory.create(categoryData);
    return category;
};

/**
 * Update category
 */
const updateCategory = async (categoryId, updates) => {
    // Check if title is being updated and if it already exists
    if (updates.title) {
        const existing = await ProductCategory.findOne({
            title: updates.title,
            _id: { $ne: categoryId },
        });

        if (existing) {
            throw ApiError.conflict("Category with this title already exists");
        }
    }

    const category = await ProductCategory.findByIdAndUpdate(
        categoryId,
        updates,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!category) {
        throw ApiError.notFound("Category not found");
    }

    return category;
};

/**
 * Delete category
 */
const deleteCategory = async (categoryId) => {
    const category = await ProductCategory.findById(categoryId);

    if (!category) {
        throw ApiError.notFound("Category not found");
    }

    // Check if category has products
    const productCount = await Product.countDocuments({
        "category._id": categoryId,
    });

    if (productCount > 0) {
        throw ApiError.badRequest(
            `Cannot delete category. ${productCount} product(s) are using this category.`
        );
    }

    await ProductCategory.findByIdAndDelete(categoryId);

    return { message: "Category deleted successfully" };
};

/**
 * Toggle category active status
 */
const toggleActiveStatus = async (categoryId) => {
    const category = await ProductCategory.findById(categoryId);

    if (!category) {
        throw ApiError.notFound("Category not found");
    }

    category.isActive = !category.isActive;
    await category.save();

    return category;
};

/**
 * Update product counts for all categories
 */
const updateProductCounts = async () => {
    const categories = await ProductCategory.find();

    for (const category of categories) {
        const count = await Product.countDocuments({
            "category._id": category._id,
            isActive: true,
        });

        category.productCount = count;
        await category.save();
    }

    return { message: "Product counts updated successfully" };
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleActiveStatus,
    updateProductCounts,
};
