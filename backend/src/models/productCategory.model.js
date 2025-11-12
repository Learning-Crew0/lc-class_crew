const mongoose = require("mongoose");

const productCategorySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Category title is required"],
            trim: true,
            unique: true,
            maxlength: [100, "Category title cannot exceed 100 characters"],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, "Description cannot exceed 500 characters"],
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
        },
        icon: {
            type: String,
        },
        order: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        productCount: {
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

// Auto-generate slug from title
productCategorySchema.pre("save", function (next) {
    if (this.isModified("title")) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();
    }
    next();
});

// Indexes
productCategorySchema.index({ title: 1 });
productCategorySchema.index({ slug: 1 });
productCategorySchema.index({ isActive: 1 });
productCategorySchema.index({ order: 1 });

const ProductCategory = mongoose.model(
    "ProductCategory",
    productCategorySchema
);

module.exports = ProductCategory;
