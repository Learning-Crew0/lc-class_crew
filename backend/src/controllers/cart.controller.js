const cartService = require("../services/cart.service");
const { successResponse } = require("../utils/response.util");

/**
 * Get user's cart
 */
const getCart = async (req, res, next) => {
  try {
    const cart = await cartService.getCart(req.user.id);
    return successResponse(res, cart, "Cart retrieved successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Add item to cart
 */
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await cartService.addToCart(req.user.id, productId, quantity);
    return successResponse(res, cart, "Item added to cart successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Update cart item
 */
const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cart = await cartService.updateCartItem(
      req.user.id,
      req.params.productId,
      quantity
    );
    return successResponse(res, cart, "Cart item updated successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Remove item from cart
 */
const removeFromCart = async (req, res, next) => {
  try {
    const cart = await cartService.removeFromCart(
      req.user.id,
      req.params.productId
    );
    return successResponse(res, cart, "Item removed from cart successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Clear cart
 */
const clearCart = async (req, res, next) => {
  try {
    const cart = await cartService.clearCart(req.user.id);
    return successResponse(res, cart, "Cart cleared successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
