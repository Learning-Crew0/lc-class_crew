const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
        rating: {
            type: Number,
            required: [true, "Rating is required"],
            min: 1,
            max: 5,
        },
        title: {
            type: String,
            trim: true,
        },
        comment: {
            type: String,
            required: [true, "Comment is required"],
        },
        isVerifiedPurchase: {
            type: Boolean,
            default: false,
        },
        isApproved: {
            type: Boolean,
            default: false,
        },
        helpful: {
            type: Number,
            default: 0,
        },
        notHelpful: {
            type: Number,
            default: 0,
        },
        response: {
            message: String,
            respondedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Admin",
            },
            respondedAt: Date,
        },
    },
    {
        timestamps: true,
    }
);

// User can only review a course or product once
reviewSchema.index({ user: 1, course: 1 }, { unique: true, sparse: true });
reviewSchema.index({ user: 1, product: 1 }, { unique: true, sparse: true });
reviewSchema.index({ course: 1, isApproved: 1 });
reviewSchema.index({ product: 1, isApproved: 1 });

// Validation: Must have either course or product, but not both
reviewSchema.pre("validate", function (next) {
    if ((!this.course && !this.product) || (this.course && this.product)) {
        next(
            new Error(
                "Review must be for either a course or a product, but not both"
            )
        );
    }
    next();
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
