const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Course title is required"],
            trim: true,
        },
        shortDescription: {
            type: String,
            trim: true,
        },
        longDescription: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Category is required"],
        },
        tagText: {
            type: String,
            trim: true,
        },
        tagColor: {
            type: String,
            default: "text-blue-500",
        },
        tags: [
            {
                type: String,
                trim: true,
            },
        ],
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: 0,
        },
        priceText: {
            type: String,
            trim: true,
        },
        date: {
            type: String,
            trim: true,
        },
        duration: {
            type: String,
            trim: true,
        },
        location: {
            type: String,
            trim: true,
        },
        hours: {
            type: Number,
            min: 0,
        },
        target: {
            type: String,
            trim: true,
        },
        recommendedAudience: [
            {
                type: String,
                trim: true,
            },
        ],
        learningGoals: {
            type: mongoose.Schema.Types.Mixed,
        },
        whatYouWillLearn: [
            {
                type: String,
                trim: true,
            },
        ],
        requirements: [
            {
                type: String,
                trim: true,
            },
        ],
        mainImage: {
            type: String,
        },
        image: {
            type: String,
        },
        hoverImage: {
            type: String,
        },
        noticeImage: {
            type: String,
        },
        field: {
            type: String,
            trim: true,
        },
        processName: {
            type: String,
            trim: true,
        },
        refundOptions: {
            type: String,
            trim: true,
        },
        level: {
            type: String,
            enum: ["beginner", "intermediate", "advanced", "all"],
            default: "all",
        },
        language: {
            type: String,
            default: "none",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        enrollmentCount: {
            type: Number,
            default: 0,
        },
        enrolledCount: {
            type: Number,
            default: 0,
        },
        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

courseSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

courseSchema.virtual("trainingSchedules", {
    ref: "TrainingSchedule",
    localField: "_id",
    foreignField: "course",
});

courseSchema.virtual("curriculum", {
    ref: "Curriculum",
    localField: "_id",
    foreignField: "course",
    justOne: true,
});

courseSchema.virtual("instructors", {
    ref: "Instructor",
    localField: "_id",
    foreignField: "course",
});

courseSchema.virtual("promotions", {
    ref: "Promotion",
    localField: "_id",
    foreignField: "course",
});

courseSchema.virtual("reviews", {
    ref: "CourseReview",
    localField: "_id",
    foreignField: "course",
});

courseSchema.virtual("notice", {
    ref: "CourseNotice",
    localField: "_id",
    foreignField: "course",
    justOne: true,
});

courseSchema.index({ title: "text", description: "text" });
courseSchema.index({ category: 1 });
courseSchema.index({ isActive: 1 });
courseSchema.index({ isFeatured: 1 });
courseSchema.index({ createdAt: -1 });

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
