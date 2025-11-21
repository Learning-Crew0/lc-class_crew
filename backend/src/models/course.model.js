const mongoose = require("mongoose");
const { CATEGORY_SLUGS, POSITION_SLUGS } = require("../constants/categories");

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
        // Category field (MongoDB ObjectId)
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Category is required"],
        },
        categoryInfo: {
            slug: String,
            koreanName: String,
            englishName: String,
            title: String, // For database categories
            id: String, // For database categories
        },
        // Position/level field (optional slug)
        position: {
            type: String,
            enum: POSITION_SLUGS,
        },
        positionInfo: {
            slug: String,
            koreanName: String,
            englishName: String,
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
        displayTag: {
            type: String,
            enum: ["NEWEST", "POPULAR", "ALL"],
            default: "ALL",
        },
        // Promotion badges (NEW - replaces displayTag for frontend display)
        promotion: {
            type: [String], // Array to support multiple promotions
            enum: [
                "group-listening", // 단체수강
                "early-bird-discount", // 얼리버드 할인
                "group-discount", // 단체할인
            ],
            default: [],
        },
        // Refund eligibility (NEW)
        refundEligible: {
            type: Boolean,
            default: true, // true = Refund, false = Non-refund
        },
        // Course name with line breaks preserved (NEW - for thumbnail display)
        courseNameFormatted: {
            type: String, // Stores course name with \n for line breaks
            maxlength: 200,
            trim: true,
        },
        // Thumbnail order within each category (NEW - for homepage ordering)
        thumbnailOrder: {
            newest: { type: Number, default: 9999 },
            popular: { type: Number, default: 9999 },
            all: { type: Number, default: 9999 },
        },
        // Training schedule status (NEW - for course list filtering)
        currentStatus: {
            type: String,
            enum: [
                "upcoming", // 예정
                "recruiting", // 모집중
                "closed", // 마감
                "confirmed", // 확정
                "cancelled", // 취소
                "in-progress", // 진행중
                "completed", // 종료
            ],
            default: "upcoming",
        },
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
        targetAudience: [
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
courseSchema.index({ position: 1 });
courseSchema.index({ category: 1, position: 1 }); // Compound index for filtering
courseSchema.index({ isActive: 1 });
courseSchema.index({ isFeatured: 1 });
courseSchema.index({ createdAt: -1 });
// New indexes for thumbnail ordering and filtering
courseSchema.index({ "thumbnailOrder.newest": 1 });
courseSchema.index({ "thumbnailOrder.popular": 1 });
courseSchema.index({ "thumbnailOrder.all": 1 });
courseSchema.index({ currentStatus: 1 });
courseSchema.index({ promotion: 1 });
courseSchema.index({ refundEligible: 1 });

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
