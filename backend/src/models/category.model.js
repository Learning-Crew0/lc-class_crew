const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Category title is required"],
            trim: true,
            unique: true,
        },
        description: {
            type: String,
            trim: true,
        },
        parentCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            default: null,
        },
        level: {
            type: Number,
            default: 1,
            min: 1,
            max: 3,
        },
        order: {
            type: Number,
            default: 0,
        },
        icon: {
            type: String,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        courseCount: {
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

categorySchema.virtual("courses", {
    ref: "Course",
    localField: "_id",
    foreignField: "category",
});

categorySchema.index({ title: 1 });
categorySchema.index({ parentCategory: 1 });
categorySchema.index({ isActive: 1 });

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
