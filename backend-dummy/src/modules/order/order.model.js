const mongoose = require("mongoose");

// Order Item Sub-Schema
const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Product is required"],
  },
  productName: {
    type: String,
    required: [true, "Product name is required"] // Store name in case product is deleted
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [1, "Quantity must be at least 1"],
  },
  priceAtTime: {
    type: Number,
    required: [true, "Price at time is required"],
    min: [0, "Price cannot be negative"]
  },
  subtotal: {
    type: Number,
    required: [true, "Subtotal is required"],
    min: [0, "Subtotal cannot be negative"]
  }
}, { _id: false });

// Shipping Address Sub-Schema
const shippingAddressSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full name is required"],
    trim: true
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true
  },
  addressLine1: {
    type: String,
    required: [true, "Address line 1 is required"],
    trim: true
  },
  addressLine2: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    required: [true, "City is required"],
    trim: true
  },
  state: {
    type: String,
    required: [true, "State is required"],
    trim: true
  },
  postalCode: {
    type: String,
    required: [true, "Postal code is required"],
    trim: true
  },
  country: {
    type: String,
    required: [true, "Country is required"],
    trim: true,
    default: "India"
  }
}, { _id: false });

// Payment Info Sub-Schema
const paymentInfoSchema = new mongoose.Schema({
  method: {
    type: String,
    enum: ["cod", "card", "upi", "netbanking", "wallet"],
    required: [true, "Payment method is required"]
  },
  transactionId: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending"
  },
  paidAt: {
    type: Date
  }
}, { _id: false });

// Main Order Schema
const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"]
    },
    items: {
      type: [orderItemSchema],
      required: [true, "Order items are required"],
      validate: {
        validator: function(items) {
          return items.length > 0;
        },
        message: "Order must have at least one item"
      }
    },
    totalItems: {
      type: Number,
      required: true,
      min: [1, "Total items must be at least 1"]
    },
    subtotal: {
      type: Number,
      required: true,
      min: [0, "Subtotal cannot be negative"]
    },
    tax: {
      type: Number,
      default: 0,
      min: [0, "Tax cannot be negative"]
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: [0, "Shipping cost cannot be negative"]
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"]
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, "Total amount cannot be negative"]
    },
    shippingAddress: {
      type: shippingAddressSchema,
      required: [true, "Shipping address is required"]
    },
    paymentInfo: {
      type: paymentInfoSchema,
      required: [true, "Payment information is required"]
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"],
      default: "pending"
    },
    trackingNumber: {
      type: String,
      trim: true
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"]
    },
    cancelReason: {
      type: String,
      trim: true
    },
    deliveredAt: {
      type: Date
    },
    cancelledAt: {
      type: Date
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ 'paymentInfo.status': 1 });

// Virtual: Check if order is cancellable
orderSchema.virtual('isCancellable').get(function() {
  return ['pending', 'confirmed'].includes(this.status);
});

// Virtual: Check if order is completed
orderSchema.virtual('isCompleted').get(function() {
  return this.status === 'delivered';
});

// Virtual: Days since order
orderSchema.virtual('daysSinceOrder').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to calculate totals
orderSchema.pre('save', function(next) {
  // Calculate subtotal from items
  this.subtotal = this.items.reduce((sum, item) => sum + item.subtotal, 0);
  
  // Calculate total items
  this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Calculate total amount
  this.totalAmount = this.subtotal + this.tax + this.shippingCost - this.discount;
  
  next();
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderNumber = `ORD-${timestamp.slice(-8)}-${random}`;
  }
  next();
});

// Instance Methods

/**
 * Cancel order
 */
orderSchema.methods.cancelOrder = async function(reason) {
  if (!this.isCancellable) {
    throw new Error('Order cannot be cancelled at this stage');
  }
  
  this.status = 'cancelled';
  this.cancelReason = reason;
  this.cancelledAt = new Date();
  
  return this.save();
};

/**
 * Mark order as delivered
 */
orderSchema.methods.markAsDelivered = async function() {
  this.status = 'delivered';
  this.deliveredAt = new Date();
  return this.save();
};

/**
 * Update order status
 */
orderSchema.methods.updateStatus = async function(newStatus) {
  const validTransitions = {
    'pending': ['confirmed', 'cancelled'],
    'confirmed': ['processing', 'cancelled'],
    'processing': ['shipped', 'cancelled'],
    'shipped': ['delivered'],
    'delivered': ['refunded'],
    'cancelled': [],
    'refunded': []
  };

  if (!validTransitions[this.status].includes(newStatus)) {
    throw new Error(`Cannot transition from ${this.status} to ${newStatus}`);
  }

  this.status = newStatus;

  if (newStatus === 'delivered') {
    this.deliveredAt = new Date();
  } else if (newStatus === 'cancelled') {
    this.cancelledAt = new Date();
  }

  return this.save();
};

/**
 * Add tracking number
 */
orderSchema.methods.addTracking = async function(trackingNumber) {
  this.trackingNumber = trackingNumber;
  return this.save();
};

/**
 * Get order summary
 */
orderSchema.methods.getSummary = function() {
  return {
    orderNumber: this.orderNumber,
    totalItems: this.totalItems,
    totalAmount: this.totalAmount,
    status: this.status,
    paymentStatus: this.paymentInfo.status,
    createdAt: this.createdAt,
    isCancellable: this.isCancellable
  };
};

// Static Methods

/**
 * Find orders by user
 */
orderSchema.statics.findByUser = function(userId, options = {}) {
  const query = this.find({ user: userId });
  
  if (options.status) {
    query.where('status').equals(options.status);
  }
  
  return query.sort({ createdAt: -1 }).populate('items.product', 'name images');
};

/**
 * Get order with full details
 */
orderSchema.statics.getOrderWithDetails = async function(orderId) {
  return this.findById(orderId)
    .populate('user', 'name email phone')
    .populate('items.product', 'name images category');
};

/**
 * Find pending orders
 */
orderSchema.statics.findPending = function() {
  return this.find({ status: 'pending' }).sort({ createdAt: -1 });
};

/**
 * Get order statistics for user
 */
orderSchema.statics.getUserStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: '$totalAmount' },
        completedOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
        },
        cancelledOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
        }
      }
    }
  ]);

  return stats[0] || {
    totalOrders: 0,
    totalSpent: 0,
    completedOrders: 0,
    cancelledOrders: 0
  };
};

module.exports = mongoose.model("Order", orderSchema);
