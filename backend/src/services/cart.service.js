const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

/**
 * Get user's cart
 */
const getCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate("items.product");

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  return cart;
};

/**
 * Add item to cart
 */
const addToCart = async (userId, productId, quantity = 1) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  if (!product.isPublished) {
    throw new Error("Product is not available");
  }

  if (product.stock.trackInventory && product.stock.quantity < quantity) {
    throw new Error("Insufficient stock");
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  // Check if product already in cart
  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;

    // Check stock again
    if (
      product.stock.trackInventory &&
      product.stock.quantity < existingItem.quantity
    ) {
      throw new Error("Insufficient stock");
    }
  } else {
    cart.items.push({
      product: productId,
      quantity,
      price: product.price,
    });
  }

  await cart.save();
  await cart.populate("items.product");

  return cart;
};

/**
 * Update cart item quantity
 */
const updateCartItem = async (userId, productId, quantity) => {
  if (quantity < 1) {
    throw new Error("Quantity must be at least 1");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.stock.trackInventory && product.stock.quantity < quantity) {
    throw new Error("Insufficient stock");
  }

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new Error("Cart not found");
  }

  const item = cart.items.find((item) => item.product.toString() === productId);

  if (!item) {
    throw new Error("Item not found in cart");
  }

  item.quantity = quantity;
  await cart.save();
  await cart.populate("items.product");

  return cart;
};

/**
 * Remove item from cart
 */
const removeFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new Error("Cart not found");
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  await cart.save();
  await cart.populate("items.product");

  return cart;
};

/**
 * Clear cart
 */
const clearCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new Error("Cart not found");
  }

  cart.items = [];
  await cart.save();

  return cart;
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
