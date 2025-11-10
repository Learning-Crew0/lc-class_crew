const cartService = require("../services/cart.service");
const asyncHandler = require("../utils/asyncHandler.util");
const ApiError = require("../utils/apiError.util");
const { successResponse } = require("../utils/response.util");

/**
 * Get user's cart with optional filtering
 * Query params: ?itemType=course | ?itemType=product
 * 
 * @route GET /api/v1/cart
 * @access Private
 */
const getCart = asyncHandler(async (req, res) => {
    if (!req.user || !req.user.id) {
        throw ApiError.unauthorized("Authentication required");
    }

    const { itemType } = req.query;

    const cart = await cartService.getCart(req.user.id, itemType);

    return successResponse(res, cart, "Cart retrieved successfully");
});

/**
 * Add course to cart
 * 
 * @route POST /api/v1/cart/add
 * @access Private
 */
const addToCart = asyncHandler(async (req, res) => {
    if (!req.user || !req.user.id) {
        throw ApiError.unauthorized("Authentication required");
    }

    const { itemType, productId, quantity, courseSchedule } = req.body;

    if (!itemType) {
        throw ApiError.badRequest("Item type is required (course or product)");
    }

    if (!productId) {
        throw ApiError.badRequest("Product/Course ID is required");
    }

    let cart;

    if (itemType === "course") {
        if (!courseSchedule) {
            throw ApiError.badRequest("Training schedule is required for courses");
        }

        cart = await cartService.addCourseToCart(
            req.user.id,
            productId,
            courseSchedule
        );
    } else if (itemType === "product") {
        cart = await cartService.addProductToCart(
            req.user.id,
            productId,
            quantity || 1
        );
    } else {
        throw ApiError.badRequest("Invalid item type. Must be 'course' or 'product'");
    }

    return successResponse(res, cart, `${itemType === 'course' ? 'Course' : 'Product'} added to cart successfully`, 201);
});

/**
 * Update product quantity in cart
 * Note: Courses cannot have quantity updated (always 1)
 * 
 * @route PUT /api/v1/cart/update/:productId
 * @access Private
 */
const updateCartItem = asyncHandler(async (req, res) => {
    if (!req.user || !req.user.id) {
        throw ApiError.unauthorized("Authentication required");
    }

    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
        throw ApiError.badRequest("Valid quantity is required (minimum 1)");
    }

    const cart = await cartService.updateCartItemQuantity(
        req.user.id,
        productId,
        quantity
    );

    return successResponse(res, cart, "Cart updated successfully");
});

/**
 * Remove item from cart
 * 
 * @route DELETE /api/v1/cart/remove/:productId
 * @access Private
 */
const removeFromCart = asyncHandler(async (req, res) => {
    if (!req.user || !req.user.id) {
        throw ApiError.unauthorized("Authentication required");
    }

    const { productId } = req.params;
    const { itemType, scheduleId } = req.query;

    if (!itemType) {
        throw ApiError.badRequest("Item type is required (course or product)");
    }

    const cart = await cartService.removeFromCart(
        req.user.id,
        itemType,
        productId,
        scheduleId
    );

    return successResponse(res, cart, "Item removed from cart successfully");
});

/**
 * Get selected courses for class application
 * 
 * @route POST /api/v1/cart/get-selected-courses
 * @access Private
 */
const getSelectedCourses = asyncHandler(async (req, res) => {
    if (!req.user || !req.user.id) {
        throw ApiError.unauthorized("Authentication required");
    }

    const { selectedProductIds } = req.body;

    if (!selectedProductIds || !Array.isArray(selectedProductIds)) {
        throw ApiError.badRequest("Selected course IDs are required as an array");
    }

    const courses = await cartService.getSelectedCoursesForApplication(
        req.user.id,
        selectedProductIds
    );

    return successResponse(res, { courses }, "Selected courses retrieved successfully");
});

/**
 * Clear entire cart
 * 
 * @route DELETE /api/v1/cart/clear
 * @access Private
 */
const clearCart = asyncHandler(async (req, res) => {
    if (!req.user || !req.user.id) {
        throw ApiError.unauthorized("Authentication required");
    }

    const cart = await cartService.clearCart(req.user.id);

    return successResponse(res, cart, "Cart cleared successfully");
});

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    getSelectedCourses,
    clearCart,
};
