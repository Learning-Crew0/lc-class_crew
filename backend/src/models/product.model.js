const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
            maxlength: [200, "Product name cannot exceed 200 characters"],
        },
        description: {
            type: String,
            required: [true, "Product description is required"],
            maxlength: [2000, "Description cannot exceed 2000 characters"],
        },
        category: {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Category",
                required: [true, "Category is required"],
            },
            title: {
                type: String,
                required: [true, "Category title is required"],
            },
        },
        baseCost: {
            type: Number,
            required: [true, "Base cost is required"],
            min: [0, "Base cost cannot be negative"],
        },
        discountRate: {
            type: Number,
            default: 0,
            min: [0, "Discount rate cannot be negative"],
            max: [100, "Discount rate cannot exceed 100%"],
        },
        finalPrice: {
            type: Number,
            min: [0, "Final price cannot be negative"],
            default: 0,
        },
        availableQuantity: {
            type: Number,
            required: [true, "Available quantity is required"],
            default: 0,
            min: [0, "Available quantity cannot be negative"],
        },
        images: {
            type: [String],
            required: [true, "At least one image is required"],
            validate: {
                validator: function (arr) {
                    return arr && arr.length > 0;
                },
                message: "At least one image is required",
            },
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Auto-calculate finalPrice based on baseCost and discountRate
productSchema.pre("save", function (next) {
    // Always calculate finalPrice if baseCost exists
    if (this.baseCost !== undefined) {
        if (this.discountRate > 0) {
            this.finalPrice = Math.round(
                this.baseCost * (1 - this.discountRate / 100)
            );
        } else {
            this.finalPrice = this.baseCost;
        }
    }
    next();
});

// Virtual field for isNew (products created within last 7 days)
productSchema.virtual("isNew").get(function () {
    const daysSinceCreation =
        (Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceCreation <= 7;
});

// Virtual field for inStock
productSchema.virtual("inStock").get(function () {
    return this.availableQuantity > 0;
});

// Text search indexes
productSchema.index({ name: "text", description: "text" });
productSchema.index({ "category._id": 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ createdAt: -1 });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
