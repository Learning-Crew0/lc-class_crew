const mongoose = require("mongoose");

const faqCategorySchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: [true, "Category key is required"],
            unique: true,
            trim: true,
            lowercase: true,
        },
        label: {
            type: String,
            required: [true, "Category label is required"],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        order: {
            type: Number,
            default: 0,
        },
        icon: {
            type: String,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        faqCount: {
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

faqCategorySchema.virtual("id").get(function () {
    return this._id.toHexString();
});

faqCategorySchema.index({ key: 1 });
faqCategorySchema.index({ order: 1 });
faqCategorySchema.index({ isActive: 1 });

const FAQCategory = mongoose.model("FAQCategory", faqCategorySchema);

module.exports = FAQCategory;

