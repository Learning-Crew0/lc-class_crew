const express = require('express');
const router = express.Router();
const cartController = require('./cart.controller');

/**
 * @route   GET /api/cart
 * @desc    Get user's cart
 * @access  Private
 */
router.get('/', cartController.getCart);

/**
 * @route   GET /api/cart/summary
 * @desc    Get cart summary (item count, total amount)
 * @access  Private
 */
router.get('/summary', cartController.getCartSummary);

/**
 * @route   POST /api/cart/add
 * @desc    Add item to cart
 * @body    { userId, productId, quantity }
 * @access  Private
 */
router.post('/add', cartController.addToCart);

/**
 * @route   PUT /api/cart/update/:productId
 * @desc    Update item quantity in cart
 * @body    { userId, quantity }
 * @access  Private
 */
router.put('/update/:productId', cartController.updateCartItem);

/**
 * @route   DELETE /api/cart/remove/:productId
 * @desc    Remove item from cart
 * @body    { userId }
 * @access  Private
 */
router.delete('/remove/:productId', cartController.removeFromCart);

/**
 * @route   DELETE /api/cart/clear
 * @desc    Clear entire cart
 * @body    { userId }
 * @access  Private
 */
router.delete('/clear', cartController.clearCart);

/**
 * @route   POST /api/cart/clean
 * @desc    Remove inactive/unavailable products from cart
 * @body    { userId }
 * @access  Private
 */
router.post('/clean', cartController.cleanCart);

module.exports = router;

