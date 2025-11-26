const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Subcategory name is required"],
            trim: true,
            maxlength: 100,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Category reference is required"],
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        order: {
            type: Number,
            default: 0,
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

// Indexes for better query performance
subcategorySchema.index({ category: 1, order: 1 });
subcategorySchema.index({ slug: 1 });
subcategorySchema.index({ isActive: 1 });

const Subcategory = mongoose.model("Subcategory", subcategorySchema);

module.exports = Subcategory;
