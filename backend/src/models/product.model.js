const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    shortDescription: {
      type: String,
      maxlength: 200,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    compareAtPrice: {
      type: Number,
      min: 0,
    },
    category: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    images: [
      {
        type: String,
      },
    ],
    thumbnail: {
      type: String,
    },
    stock: {
      quantity: {
        type: Number,
        default: 0,
        min: 0,
      },
      trackInventory: {
        type: Boolean,
        default: true,
      },
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    weight: {
      value: Number,
      unit: {
        type: String,
        enum: ["g", "kg", "lb", "oz"],
        default: "kg",
      },
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: {
        type: String,
        enum: ["cm", "in"],
        default: "cm",
      },
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    salesCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Generate slug from name
productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }
  next();
});

// Virtual for discount percentage
productSchema.virtual("discountPercentage").get(function () {
  if (!this.compareAtPrice || this.compareAtPrice <= this.price) return 0;
  return Math.round(
    ((this.compareAtPrice - this.price) / this.compareAtPrice) * 100
  );
});

// Virtual for in stock status
productSchema.virtual("inStock").get(function () {
  if (!this.stock.trackInventory) return true;
  return this.stock.quantity > 0;
});

// Indexes
productSchema.index({ name: "text", description: "text" });
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ isPublished: 1 });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
