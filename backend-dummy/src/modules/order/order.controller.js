const Order = require('./order.model');
const Cart = require('../cart/cart.model');
const Product = require('../product/product.model');
const mongoose = require('mongoose');

/**
 * @desc    Create new order from cart
 * @route   POST /api/orders/create
 * @access  Private
 */
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId;
    const { shippingAddress, paymentMethod, notes } = req.body;

    // Validate user
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Validate shipping address
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || 
        !shippingAddress.addressLine1 || !shippingAddress.city || 
        !shippingAddress.state || !shippingAddress.postalCode) {
      return res.status(400).json({
        success: false,
        message: 'Complete shipping address is required'
      });
    }

    // Validate payment method
    if (!paymentMethod || !['cod', 'card', 'upi', 'netbanking', 'wallet'].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Valid payment method is required (cod, card, upi, netbanking, wallet)'
      });
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Validate all products availability
    const validationErrors = [];
    
    for (const item of cart.items) {
      const product = item.product;
      
      if (!product) {
        validationErrors.push(`Product ${item.product} not found`);
        continue;
      }

      if (!product.isActive) {
        validationErrors.push(`${product.name} is no longer available`);
      }

      if (product.availableQuantity < item.quantity) {
        validationErrors.push(
          `${product.name}: Only ${product.availableQuantity} items in stock, but ${item.quantity} requested`
        );
      }
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Some items in your cart are not available',
        errors: validationErrors
      });
    }

    // Prepare order items
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      productName: item.product.name,
      quantity: item.quantity,
      priceAtTime: item.priceAtTime,
      subtotal: item.subtotal
    }));

    // Calculate order totals
    const subtotal = cart.totalAmount;
    const tax = subtotal * 0.18; // 18% GST
    const shippingCost = subtotal > 500 ? 0 : 50; // Free shipping above 500
    const discount = 0; // Can be added based on promo codes
    const totalAmount = subtotal + tax + shippingCost - discount;

    // Create order
    const order = await Order.create({
      user: userId,
      items: orderItems,
      subtotal: subtotal,
      tax: tax,
      shippingCost: shippingCost,
      discount: discount,
      totalAmount: totalAmount,
      shippingAddress: shippingAddress,
      paymentInfo: {
        method: paymentMethod,
        status: paymentMethod === 'cod' ? 'pending' : 'pending'
      },
      notes: notes || ''
    });

    // Update product quantities
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { availableQuantity: -item.quantity } }
      );
    }

    // Clear cart after order creation
    await cart.clearCart();

    // Populate order details
    const populatedOrder = await Order.findById(order._id)
      .populate('items.product', 'name images category');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: populatedOrder
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

/**
 * @desc    Get all orders for a user
 * @route   GET /api/orders
 * @access  Private
 */
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user?._id || req.query.userId;
    const { status } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const options = {};
    if (status) {
      options.status = status;
    }

    const orders = await Order.findByUser(userId, options);

    res.status(200).json({
      success: true,
      count: orders.length,
      orders: orders
    });

  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders',
      error: error.message
    });
  }
};

/**
 * @desc    Get single order by ID
 * @route   GET /api/orders/:orderId
 * @access  Private
 */
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?._id || req.query.userId;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID'
      });
    }

    const order = await Order.getOrderWithDetails(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order belongs to user (if userId provided)
    if (userId && order.user._id.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      order: order
    });

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve order',
      error: error.message
    });
  }
};

/**
 * @desc    Cancel order
 * @route   PUT /api/orders/:orderId/cancel
 * @access  Private
 */
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?._id || req.body.userId;
    const { reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID'
      });
    }

    const order = await Order.findById(orderId).populate('items.product');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order belongs to user
    if (userId && order.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Cancel order
    try {
      await order.cancelOrder(reason || 'Cancelled by user');

      // Restore product quantities
      for (const item of order.items) {
        if (item.product) {
          await Product.findByIdAndUpdate(
            item.product._id,
            { $inc: { availableQuantity: item.quantity } }
          );
        }
      }

      res.status(200).json({
        success: true,
        message: 'Order cancelled successfully',
        order: order
      });

    } catch (cancelError) {
      return res.status(400).json({
        success: false,
        message: cancelError.message
      });
    }

  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  }
};

/**
 * @desc    Update order status (Admin)
 * @route   PUT /api/orders/:orderId/status
 * @access  Admin
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, trackingNumber } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID'
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update status
    try {
      await order.updateStatus(status);

      // Add tracking number if provided
      if (trackingNumber && status === 'shipped') {
        await order.addTracking(trackingNumber);
      }

      res.status(200).json({
        success: true,
        message: 'Order status updated successfully',
        order: order
      });

    } catch (statusError) {
      return res.status(400).json({
        success: false,
        message: statusError.message
      });
    }

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
};

/**
 * @desc    Get user order statistics
 * @route   GET /api/orders/stats/:userId
 * @access  Private
 */
exports.getUserOrderStats = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?._id;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid user ID is required'
      });
    }

    const stats = await Order.getUserStats(userId);

    res.status(200).json({
      success: true,
      stats: stats
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve order statistics',
      error: error.message
    });
  }
};

/**
 * @desc    Get all orders (Admin)
 * @route   GET /api/orders/admin/all
 * @access  Admin
 */
exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const totalOrders = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      count: orders.length,
      totalOrders: totalOrders,
      page: parseInt(page),
      totalPages: Math.ceil(totalOrders / parseInt(limit)),
      orders: orders
    });

  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders',
      error: error.message
    });
  }
};

/**
 * @desc    Get order by order number
 * @route   GET /api/orders/track/:orderNumber
 * @access  Public
 */
exports.trackOrder = async (req, res) => {
  try {
    const { orderNumber } = req.params;

    if (!orderNumber) {
      return res.status(400).json({
        success: false,
        message: 'Order number is required'
      });
    }

    const order = await Order.findOne({ orderNumber: orderNumber })
      .populate('items.product', 'name images');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        status: order.status,
        trackingNumber: order.trackingNumber,
        createdAt: order.createdAt,
        deliveredAt: order.deliveredAt,
        items: order.items,
        shippingAddress: order.shippingAddress
      }
    });

  } catch (error) {
    console.error('Track order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track order',
      error: error.message
    });
  }
};

