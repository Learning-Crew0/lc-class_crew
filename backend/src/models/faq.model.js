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
        viewCount: {
            type: Number,
            default: 0,
        },
        helpfulCount: {
            type: Number,
            default: 0,
        },
        notHelpful: {
            type: Number,
            default: 0,
        },
        slug: {
            type: String,
            unique: true,
            sparse: true,
        },
        metaDescription: {
            type: String,
            trim: true,
            maxlength: 200,
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

// Generate slug from question before saving
faqSchema.pre("save", function (next) {
    if (this.isModified("question") || !this.slug) {
        const slugify = require("slugify");
        const baseSlug = slugify(this.question.substring(0, 100), {
            lower: true,
            strict: true,
            locale: "ko",
        });
        this.slug = `${baseSlug}-${Date.now()}`;
    }
    next();
});

faqSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

faqSchema.index({ category: 1, order: 1 });
faqSchema.index({ isActive: 1 });
faqSchema.index({ isFeatured: -1 });
faqSchema.index({ question: "text", answer: "text" });
faqSchema.index({ slug: 1 });
faqSchema.index({ createdAt: -1 });

const FAQ = mongoose.model("FAQ", faqSchema);

module.exports = FAQ;
