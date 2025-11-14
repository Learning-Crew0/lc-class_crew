const mongoose = require("mongoose");

const courseReviewSchema = new mongoose.Schema(
    {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: [true, "Course reference is required"],
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        reviewerName: {
            type: String,
            required: [true, "Reviewer name is required"],
            trim: true,
        },
        text: {
            type: String,
            required: [true, "Review text is required"],
            minlength: [10, "Review must be at least 10 characters long"],
            maxlength: [1000, "Review cannot exceed 1000 characters"],
        },
        avatar: {
            type: String,
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
        },
        isApproved: {
            type: Boolean,
            default: true, // Auto-approve all reviews
        },
        isVerifiedPurchase: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

courseReviewSchema.index({ course: 1, createdAt: -1 });
courseReviewSchema.index({ isApproved: 1 });

const CourseReview = mongoose.model("CourseReview", courseReviewSchema);

module.exports = CourseReview;
