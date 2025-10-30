const mongoose = require("mongoose");

// Cart Item Sub-Schema
const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Product is required"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [1, "Quantity must be at least 1"],
    validate: {
      validator: Number.isInteger,
      message: "Quantity must be an integer"
    }
  },
  priceAtTime: {
    type: Number,
    required: [true, "Price at time is required"],
    min: [0, "Price cannot be negative"]
  },
  subtotal: {
    type: Number,
    default: 0,
    min: [0, "Subtotal cannot be negative"]
  }
}, { _id: false });

// Calculate subtotal before saving
cartItemSchema.pre('save', function(next) {
  this.subtotal = this.priceAtTime * this.quantity;
  next();
});

// Main Cart Schema
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      unique: true, // Each user has one cart
      index: true // For faster queries
    },
    items: {
      type: [cartItemSchema],
      default: [],
      validate: {
        validator: function(items) {
          // Check for duplicate products
          const productIds = items.map(item => item.product.toString());
          return productIds.length === new Set(productIds).size;
        },
        message: "Duplicate products in cart are not allowed"
      }
    },
    totalItems: {
      type: Number,
      default: 0,
      min: [0, "Total items cannot be negative"]
    },
    totalAmount: {
      type: Number,
      default: 0,
      min: [0, "Total amount cannot be negative"]
    },
    lastModified: {
      type: Date,
      default: Date.now
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for performance
cartSchema.index({ user: 1, updatedAt: -1 });
cartSchema.index({ 'items.product': 1 });

// Virtual: Check if cart is empty
cartSchema.virtual('isEmpty').get(function() {
  return this.items.length === 0;
});

// Virtual: Get item count
cartSchema.virtual('itemCount').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Pre-save middleware to calculate totals
cartSchema.pre('save', function(next) {
  // Calculate subtotal for each item
  this.items.forEach(item => {
    item.subtotal = item.priceAtTime * item.quantity;
  });
  
  // Calculate total items and total amount
  this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
  this.totalAmount = this.items.reduce((sum, item) => sum + item.subtotal, 0);
  this.lastModified = new Date();
  
  next();
});

// Instance Methods

/**
 * Add item to cart or update quantity if already exists
 */
cartSchema.methods.addItem = async function(productId, quantity, price) {
  const existingItemIndex = this.items.findIndex(
    item => item.product.toString() === productId.toString()
  );

  if (existingItemIndex > -1) {
    // Update existing item
    this.items[existingItemIndex].quantity += quantity;
    this.items[existingItemIndex].subtotal = 
      this.items[existingItemIndex].priceAtTime * this.items[existingItemIndex].quantity;
  } else {
    // Add new item
    this.items.push({
      product: productId,
      quantity: quantity,
      priceAtTime: price,
      subtotal: price * quantity
    });
  }

  return this.save();
};

/**
 * Update item quantity
 */
cartSchema.methods.updateItemQuantity = async function(productId, quantity) {
  const item = this.items.find(
    item => item.product.toString() === productId.toString()
  );

  if (!item) {
    throw new Error('Item not found in cart');
  }

  if (quantity <= 0) {
    // Remove item if quantity is 0 or negative
    return this.removeItem(productId);
  }

  item.quantity = quantity;
  item.subtotal = item.priceAtTime * item.quantity;

  return this.save();
};

/**
 * Remove item from cart
 */
cartSchema.methods.removeItem = async function(productId) {
  this.items = this.items.filter(
    item => item.product.toString() !== productId.toString()
  );

  return this.save();
};

/**
 * Clear all items from cart
 */
cartSchema.methods.clearCart = async function() {
  this.items = [];
  this.totalItems = 0;
  this.totalAmount = 0;
  return this.save();
};

/**
 * Get cart summary
 */
cartSchema.methods.getSummary = function() {
  return {
    itemCount: this.itemCount,
    totalItems: this.totalItems,
    totalAmount: this.totalAmount,
    isEmpty: this.isEmpty,
    lastModified: this.lastModified
  };
};

/**
 * Check if product exists in cart
 */
cartSchema.methods.hasProduct = function(productId) {
  return this.items.some(
    item => item.product.toString() === productId.toString()
  );
};

/**
 * Get item by product ID
 */
cartSchema.methods.getItem = function(productId) {
  return this.items.find(
    item => item.product.toString() === productId.toString()
  );
};

// Static Methods

/**
 * Find or create cart for user
 */
cartSchema.statics.findOrCreateCart = async function(userId) {
  let cart = await this.findOne({ user: userId }).populate('items.product');
  
  if (!cart) {
    cart = await this.create({ user: userId, items: [] });
  }
  
  return cart;
};

/**
 * Get cart with full product details
 */
cartSchema.statics.getCartWithProducts = async function(userId) {
  return this.findOne({ user: userId })
    .populate({
      path: 'items.product',
      select: 'name images finalAmount availableQuantity isActive category',
      populate: {
        path: 'category',
        select: 'title'
      }
    });
};

/**
 * Remove inactive or unavailable products from cart
 */
cartSchema.methods.cleanCart = async function() {
  await this.populate('items.product');
  
  this.items = this.items.filter(item => {
    const product = item.product;
    return product && product.isActive && product.availableQuantity > 0;
  });
  
  return this.save();
};

module.exports = mongoose.model("Cart", cartSchema);
