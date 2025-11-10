const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const { authenticate } = require("../middlewares/auth.middleware");

// All cart routes require authentication
router.use(authenticate);

/**
 * Get cart with optional filtering
 * Query: ?itemType=course or ?itemType=product
 */
router.get("/", cartController.getCart);

/**
 * Add item to cart (course or product)
 * Body: { itemType, productId, quantity?, courseSchedule? }
 */
router.post("/add", cartController.addToCart);

/**
 * Get selected courses for class application
 * Body: { selectedProductIds: [String] }
 */
router.post("/get-selected-courses", cartController.getSelectedCourses);

/**
 * Update product quantity
 * Params: productId
 * Body: { quantity }
 */
router.put("/update/:productId", cartController.updateCartItem);

/**
 * Remove item from cart
 * Params: productId
 * Query: itemType, scheduleId?
 */
router.delete("/remove/:productId", cartController.removeFromCart);

/**
 * Clear entire cart
 */
router.delete("/clear", cartController.clearCart);

module.exports = router;
