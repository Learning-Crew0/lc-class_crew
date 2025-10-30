const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductCategory",
      required: [true, "Product category is required"],
    },
    baseCost: {
      type: Number,
      required: [true, "Base cost is required"],
      min: [0, "Cost cannot be negative"],
    },
    discountRate: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100%"],
    },
    finalAmount: {
      type: Number,
      min: [0, "Final amount cannot be negative"],
    },
    availableQuantity: {
      type: Number,
      default: 0,
      min: [0, "Quantity cannot be negative"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    images: [
      {
        type: String, // Cloudinary URLs
        validate: {
          validator: function(v) {
            return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
          },
          message: 'Invalid image URL format'
        }
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Pre-save middleware to calculate finalAmount
productSchema.pre('save', function(next) {
  if (this.baseCost && this.discountRate !== undefined) {
    this.finalAmount = this.baseCost - (this.baseCost * this.discountRate / 100);
  }
  next();
});

// Pre-update middleware to calculate finalAmount
productSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function(next) {
  const update = this.getUpdate();
  if (update.baseCost !== undefined || update.discountRate !== undefined) {
    const baseCost = update.baseCost !== undefined ? update.baseCost : this.baseCost;
    const discountRate = update.discountRate !== undefined ? update.discountRate : this.discountRate;
    if (baseCost !== undefined && discountRate !== undefined) {
      update.finalAmount = baseCost - (baseCost * discountRate / 100);
    }
  }
  next();
});

// Virtual for discount amount
productSchema.virtual('discountAmount').get(function() {
  return this.baseCost ? (this.baseCost * this.discountRate / 100) : 0;
});

// Virtual for savings percentage
productSchema.virtual('savingsPercentage').get(function() {
  return this.discountRate || 0;
});

// Method to check if product is in stock
productSchema.methods.isInStock = function() {
  return this.availableQuantity > 0;
};

// Method to check if product is available (active and in stock)
productSchema.methods.isAvailable = function() {
  return this.isActive && this.isInStock();
};

// Static method to find products by category
productSchema.statics.findByCategory = function(categoryId) {
  return this.find({ category: categoryId, isActive: true });
};

// Static method to find active products
productSchema.statics.findActive = function() {
  return this.find({ isActive: true });
};

module.exports = mongoose.model("Product", productSchema);
