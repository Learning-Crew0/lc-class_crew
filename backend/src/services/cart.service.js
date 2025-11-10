const Cart = require("../models/cart.model");
const Course = require("../models/course.model");
const TrainingSchedule = require("../models/trainingSchedule.model");
const Product = require("../models/product.model");
const ApiError = require("../utils/apiError.util");

/**
 * Get or create user's cart
 * @param {String} userId
 * @returns {Promise<Cart>}
 */
const getOrCreateCart = async (userId) => {
    let cart = await Cart.findOne({ user: userId })
        .populate({
            path: "items.course",
            select: "title price mainImage category isActive",
        })
        .populate({
            path: "items.courseSchedule",
            select: "scheduleName startDate endDate availableSeats enrolledCount isActive",
        })
        .populate({
            path: "items.product",
            select: "title price images isPublished stock",
        });

    if (!cart) {
        cart = await Cart.create({
            user: userId,
            items: [],
        });
    }

    return cart;
};

/**
 * Get cart with optional itemType filter
 * @param {String} userId
 * @param {String} itemType - Optional: "course" or "product"
 * @returns {Promise<Object>}
 */
const getCart = async (userId, itemType = null) => {
    const cart = await getOrCreateCart(userId);

    // Filter items by type if specified
    let items = cart.items;
    if (itemType) {
        items = items.filter((item) => item.itemType === itemType);
    }

    return {
        _id: cart._id,
        user: cart.user,
        items,
        itemCount: items.length,
        totalAmount: items.reduce((sum, item) => sum + item.subtotal, 0),
        lastUpdated: cart.lastUpdated,
    };
};

/**
 * Add course to cart
 * @param {String} userId
 * @param {String} courseId
 * @param {String} courseScheduleId
 * @returns {Promise<Cart>}
 */
const addCourseToCart = async (userId, courseId, courseScheduleId) => {
    // Validate course
    const course = await Course.findById(courseId);
    if (!course) {
        throw ApiError.notFound("Course not found");
    }
    if (!course.isActive) {
        throw ApiError.badRequest("Course is not available");
    }

    // Validate training schedule
    const schedule = await TrainingSchedule.findById(courseScheduleId);
    if (!schedule) {
        throw ApiError.notFound("Training schedule not found");
    }
    if (!schedule.isActive) {
        throw ApiError.badRequest("Training schedule is not available");
    }
    if (schedule.course.toString() !== courseId) {
        throw ApiError.badRequest(
            "Training schedule does not belong to this course"
        );
    }
    if (schedule.enrolledCount >= schedule.availableSeats) {
        throw ApiError.badRequest("Training schedule is fully booked");
    }

    // Get or create cart
    const cart = await Cart.findOne({ user: userId });
    let userCart = cart || new Cart({ user: userId, items: [] });

    // Check if course with same schedule already in cart
    const existingItem = userCart.items.find(
        (item) =>
            item.itemType === "course" &&
            item.course?.toString() === courseId &&
            item.courseSchedule?.toString() === courseScheduleId
    );

    if (existingItem) {
        throw ApiError.badRequest(
            "This course with the selected schedule is already in your cart"
        );
    }

    // Calculate pricing
    const priceAtTime = course.price || 0;
    const quantity = 1; // Courses always have quantity of 1
    const subtotal = priceAtTime * quantity;

    // Add to cart
    userCart.items.push({
        itemType: "course",
        course: courseId,
        courseSchedule: courseScheduleId,
        quantity,
        priceAtTime,
        subtotal,
    });

    await userCart.save();

    // Populate and return
    await userCart.populate("items.course items.courseSchedule");
    return userCart;
};

/**
 * Add product to cart
 * @param {String} userId
 * @param {String} productId
 * @param {Number} quantity
 * @returns {Promise<Cart>}
 */
const addProductToCart = async (userId, productId, quantity = 1) => {
    // Validate product
    const product = await Product.findById(productId);
    if (!product) {
        throw ApiError.notFound("Product not found");
    }
    if (!product.isPublished) {
        throw ApiError.badRequest("Product is not available");
    }

    // Check stock
    if (product.stock?.trackInventory && product.stock.quantity < quantity) {
        throw ApiError.badRequest("Insufficient stock");
    }

    // Get or create cart
    const cart = await Cart.findOne({ user: userId });
    let userCart = cart || new Cart({ user: userId, items: [] });

    // Check if product already in cart
    const existingItem = userCart.items.find(
        (item) =>
            item.itemType === "product" &&
            item.product?.toString() === productId
    );

    if (existingItem) {
        // Update quantity
        const newQuantity = existingItem.quantity + quantity;

        // Check stock again
        if (
            product.stock?.trackInventory &&
            product.stock.quantity < newQuantity
        ) {
            throw ApiError.badRequest(
                "Insufficient stock for requested quantity"
            );
        }

        existingItem.quantity = newQuantity;
        existingItem.subtotal = existingItem.priceAtTime * newQuantity;
    } else {
        // Add new item
        const priceAtTime = product.price || 0;
        const subtotal = priceAtTime * quantity;

        userCart.items.push({
            itemType: "product",
            product: productId,
            quantity,
            priceAtTime,
            subtotal,
        });
    }

    await userCart.save();

    // Populate and return
    await userCart.populate("items.product");
    return userCart;
};

/**
 * Update product quantity in cart
 * @param {String} userId
 * @param {String} productId
 * @param {Number} quantity
 * @returns {Promise<Cart>}
 */
const updateCartItemQuantity = async (userId, productId, quantity) => {
    if (quantity < 1) {
        throw ApiError.badRequest("Quantity must be at least 1");
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        throw ApiError.notFound("Cart not found");
    }

    // Find the product item
    const item = cart.items.find(
        (i) => i.itemType === "product" && i.product?.toString() === productId
    );

    if (!item) {
        throw ApiError.notFound("Product not found in cart");
    }

    // Validate stock
    const product = await Product.findById(productId);
    if (product.stock?.trackInventory && product.stock.quantity < quantity) {
        throw ApiError.badRequest("Insufficient stock");
    }

    // Update quantity and subtotal
    item.quantity = quantity;
    item.subtotal = item.priceAtTime * quantity;

    await cart.save();
    await cart.populate("items.product items.course items.courseSchedule");

    return cart;
};

/**
 * Remove item from cart
 * @param {String} userId
 * @param {String} itemType - "course" or "product"
 * @param {String} itemId - Course ID or Product ID
 * @param {String} scheduleId - Optional: Training schedule ID for courses
 * @returns {Promise<Cart>}
 */
const removeFromCart = async (userId, itemType, itemId, scheduleId = null) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        throw ApiError.notFound("Cart not found");
    }

    if (itemType === "course") {
        cart.items = cart.items.filter(
            (item) =>
                !(
                    item.itemType === "course" &&
                    item.course?.toString() === itemId &&
                    (!scheduleId ||
                        item.courseSchedule?.toString() === scheduleId)
                )
        );
    } else if (itemType === "product") {
        cart.items = cart.items.filter(
            (item) =>
                !(
                    item.itemType === "product" &&
                    item.product?.toString() === itemId
                )
        );
    }

    await cart.save();
    await cart.populate("items.product items.course items.courseSchedule");

    return cart;
};

/**
 * Get selected courses for class application
 * @param {String} userId
 * @param {Array<String>} selectedCourseIds
 * @returns {Promise<Array>}
 */
const getSelectedCoursesForApplication = async (userId, selectedCourseIds) => {
    const cart = await Cart.findOne({ user: userId })
        .populate("items.course")
        .populate("items.courseSchedule");

    if (!cart) {
        throw ApiError.notFound("Cart not found");
    }

    // Filter only selected course items
    const selectedItems = cart.items.filter(
        (item) =>
            item.itemType === "course" &&
            selectedCourseIds.includes(item.course._id.toString())
    );

    if (selectedItems.length === 0) {
        throw ApiError.badRequest("No valid courses selected");
    }

    // Validate: Only courses can be selected for class application
    const invalidItems = cart.items.filter(
        (item) =>
            selectedCourseIds.includes(item.product?._id.toString()) &&
            item.itemType !== "course"
    );

    if (invalidItems.length > 0) {
        throw ApiError.badRequest(
            "Only courses can be selected for class application. Products cannot be selected."
        );
    }

    return selectedItems.map((item) => ({
        _id: item.course._id,
        name: item.course.title,
        trainingSchedule: item.courseSchedule,
        price: item.priceAtTime,
        discountedPrice: item.priceAtTime, // TODO: Calculate discount
        thumbnail: item.course.mainImage,
        cartItemId: item._id,
    }));
};

/**
 * Clear entire cart
 * @param {String} userId
 * @returns {Promise<Cart>}
 */
const clearCart = async (userId) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        throw ApiError.notFound("Cart not found");
    }

    cart.items = [];
    await cart.save();

    return cart;
};

/**
 * Remove courses from cart after application submission
 * @param {String} userId
 * @param {Array<String>} courseIds
 * @returns {Promise<Cart>}
 */
const removeCoursesAfterApplication = async (userId, courseIds) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        throw ApiError.notFound("Cart not found");
    }

    cart.items = cart.items.filter(
        (item) =>
            !(
                item.itemType === "course" &&
                courseIds.includes(item.course?.toString())
            )
    );

    await cart.save();
    await cart.populate("items.product items.course items.courseSchedule");

    return cart;
};

module.exports = {
    getCart,
    addCourseToCart,
    addProductToCart,
    updateCartItemQuantity,
    removeFromCart,
    getSelectedCoursesForApplication,
    clearCart,
    removeCoursesAfterApplication,
};
