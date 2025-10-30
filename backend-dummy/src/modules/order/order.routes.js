const express = require('express');
const router = express.Router();
const orderController = require('./order.controller');

/**
 * @route   POST /api/orders/create
 * @desc    Create new order from cart
 * @body    { userId, shippingAddress, paymentMethod, notes }
 * @access  Private
 */
router.post('/create', orderController.createOrder);

/**
 * @route   GET /api/orders
 * @desc    Get all orders for a user
 * @query   userId, status (optional)
 * @access  Private
 */
router.get('/', orderController.getUserOrders);

/**
 * @route   GET /api/orders/stats/:userId
 * @desc    Get user order statistics
 * @access  Private
 */
router.get('/stats/:userId', orderController.getUserOrderStats);

/**
 * @route   GET /api/orders/admin/all
 * @desc    Get all orders (Admin only)
 * @query   status, page, limit
 * @access  Admin
 */
router.get('/admin/all', orderController.getAllOrders);

/**
 * @route   GET /api/orders/track/:orderNumber
 * @desc    Track order by order number
 * @access  Public
 */
router.get('/track/:orderNumber', orderController.trackOrder);

/**
 * @route   GET /api/orders/:orderId
 * @desc    Get single order by ID
 * @query   userId (optional for verification)
 * @access  Private
 */
router.get('/:orderId', orderController.getOrderById);

/**
 * @route   PUT /api/orders/:orderId/cancel
 * @desc    Cancel order
 * @body    { userId, reason }
 * @access  Private
 */
router.put('/:orderId/cancel', orderController.cancelOrder);

/**
 * @route   PUT /api/orders/:orderId/status
 * @desc    Update order status (Admin only)
 * @body    { status, trackingNumber }
 * @access  Admin
 */
router.put('/:orderId/status', orderController.updateOrderStatus);

module.exports = router;

