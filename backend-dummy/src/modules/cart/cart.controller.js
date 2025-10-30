const Cart = require("./cart.model");
const Product = require("../product/product.model");
const mongoose = require("mongoose");

/**
 * @desc    Get user's cart
 * @route   GET /api/cart
 * @access  Private
 */
exports.getCart = async (req, res) => {
  try {
    // For GET requests, body is not available, so check query params first
    const userId =
      req.query.userId ||
      req.user?._id ||
      (req.body ? req.body.userId : undefined);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const cart = await Cart.getCartWithProducts(userId);

    if (!cart) {
      // Create empty cart if doesn't exist
      const newCart = await Cart.create({ user: userId, items: [] });
      return res.status(200).json({
        success: true,
        message: "New cart created",
        cart: newCart,
        summary: newCart.getSummary(),
      });
    }

    res.status(200).json({
      success: true,
      cart: cart,
      summary: cart.getSummary(),
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve cart",
      error: error.message,
    });
  }
};

/**
 * @desc    Add item to cart
 * @route   POST /api/cart/add
 * @access  Private
 */
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId;
    const { productId, quantity = 1 } = req.body;

    // Validate input
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    // Check if product exists and is available
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (!product.isActive) {
      return res.status(400).json({
        success: false,
        message: "Product is not available",
      });
    }

    if (product.availableQuantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.availableQuantity} items available in stock`,
      });
    }

    // Find or create cart
    let cart = await Cart.findOrCreateCart(userId);

    // Check if product already in cart
    const existingItem = cart.getItem(productId);
    const newQuantity = existingItem
      ? existingItem.quantity + quantity
      : quantity;

    if (product.availableQuantity < newQuantity) {
      return res.status(400).json({
        success: false,
        message: `Cannot add ${quantity} more. Only ${
          product.availableQuantity - (existingItem?.quantity || 0)
        } items available`,
      });
    }

    // Add item to cart
    await cart.addItem(productId, quantity, product.finalAmount);

    // Populate and return updated cart
    cart = await Cart.getCartWithProducts(userId);

    res.status(200).json({
      success: true,
      message: "Item added to cart successfully",
      cart: cart,
      summary: cart.getSummary(),
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add item to cart",
      error: error.message,
    });
  }
};

/**
 * @desc    Update item quantity in cart
 * @route   PUT /api/cart/update/:productId
 * @access  Private
 */
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId;
    const { productId } = req.params;
    const { quantity } = req.body;

    // Validate input
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid quantity is required",
      });
    }

    // Get cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Check if item exists in cart
    if (!cart.hasProduct(productId)) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    // If quantity is 0, remove item
    if (quantity === 0) {
      await cart.removeItem(productId);
      cart = await Cart.getCartWithProducts(userId);

      return res.status(200).json({
        success: true,
        message: "Item removed from cart",
        cart: cart,
        summary: cart.getSummary(),
      });
    }

    // Check product availability
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.availableQuantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.availableQuantity} items available in stock`,
      });
    }

    // Update quantity
    await cart.updateItemQuantity(productId, quantity);
    cart = await Cart.getCartWithProducts(userId);

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart: cart,
      summary: cart.getSummary(),
    });
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update cart",
      error: error.message,
    });
  }
};

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/remove/:productId
 * @access  Private
 */
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId;
    const { productId } = req.params;

    // Validate input
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // Get cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Check if item exists
    if (!cart.hasProduct(productId)) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    // Remove item
    await cart.removeItem(productId);
    cart = await Cart.getCartWithProducts(userId);

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart: cart,
      summary: cart.getSummary(),
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove item from cart",
      error: error.message,
    });
  }
};

/**
 * @desc    Clear entire cart
 * @route   DELETE /api/cart/clear
 * @access  Private
 */
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    await cart.clearCart();

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart: cart,
    });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to clear cart",
      error: error.message,
    });
  }
};

/**
 * @desc    Clean cart (remove inactive/unavailable products)
 * @route   POST /api/cart/clean
 * @access  Private
 */
exports.cleanCart = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemCountBefore = cart.items.length;
    await cart.cleanCart();
    const itemCountAfter = cart.items.length;

    cart = await Cart.getCartWithProducts(userId);

    res.status(200).json({
      success: true,
      message: `Cart cleaned. ${
        itemCountBefore - itemCountAfter
      } unavailable items removed`,
      cart: cart,
      summary: cart.getSummary(),
    });
  } catch (error) {
    console.error("Clean cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to clean cart",
      error: error.message,
    });
  }
};

/**
 * @desc    Get cart summary
 * @route   GET /api/cart/summary
 * @access  Private
 */
exports.getCartSummary = async (req, res) => {
  try {
    // For GET requests, body is not available, so check query params first
    const userId =
      req.query.userId ||
      req.user?._id ||
      (req.body ? req.body.userId : undefined);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(200).json({
        success: true,
        summary: {
          itemCount: 0,
          totalItems: 0,
          totalAmount: 0,
          isEmpty: true,
        },
      });
    }

    res.status(200).json({
      success: true,
      summary: cart.getSummary(),
    });
  } catch (error) {
    console.error("Get cart summary error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get cart summary",
      error: error.message,
    });
  }
};
