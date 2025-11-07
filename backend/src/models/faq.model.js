const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: [true, "Question is required"],
            trim: true,
            minlength: 5,
            maxlength: 500,
        },
        answer: {
            type: String,
            required: [true, "Answer is required"],
            trim: true,
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true,
        },
        categoryLabel: {
            type: String,
            trim: true,
        },
        order: {
            type: Number,
            default: 0,
        },
        tags: [
            {
                type: String,
                trim: true,
            },
        ],
        views: {
            type: Number,
            default: 0,
        },
        helpful: {
            type: Number,
            default: 0,
        },
        notHelpful: {
            type: Number,
            default: 0,
        },
        relatedFAQs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "FAQ",
            },
        ],
        relatedArticles: [
            {
                type: String,
                trim: true,
            },
        ],
        isActive: {
            type: Boolean,
            default: true,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
        },
        lastModifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

faqSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

faqSchema.index({ category: 1, order: 1 });
faqSchema.index({ isActive: 1 });
faqSchema.index({ isFeatured: -1 });
faqSchema.index({ question: "text", answer: "text" });
faqSchema.index({ createdAt: -1 });

const FAQ = mongoose.model("FAQ", faqSchema);

module.exports = FAQ;
