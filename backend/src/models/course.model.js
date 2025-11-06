const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
    sessionNumber: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    date: {
        type: Date,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
});

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Course title is required"],
            trim: true,
            unique: true,
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
        },
        description: {
            type: String,
            required: [true, "Course description is required"],
        },
        shortDescription: {
            type: String,
            maxlength: 200,
        },
        instructor: {
            type: String,
            required: true,
            trim: true,
        },
        duration: {
            value: {
                type: Number,
                required: true,
            },
            unit: {
                type: String,
                enum: ["hours", "days", "weeks", "months"],
                default: "weeks",
            },
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: 0,
        },
        thumbnail: {
            type: String,
        },
        images: [
            {
                type: String,
            },
        ],
        category: {
            type: String,
            trim: true,
        },
        tags: [
            {
                type: String,
                trim: true,
            },
        ],
        level: {
            type: String,
            enum: ["beginner", "intermediate", "advanced"],
            default: "beginner",
        },
        maxStudents: {
            type: Number,
            default: 30,
        },
        sessions: [sessionSchema],
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        schedulePattern: {
            daysOfWeek: [
                {
                    type: String,
                    enum: [
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday",
                    ],
                },
            ],
            startTime: String,
            endTime: String,
        },
        prerequisites: [
            {
                type: String,
            },
        ],
        learningOutcomes: [
            {
                type: String,
            },
        ],
        certificateEligibility: {
            enabled: {
                type: Boolean,
                default: true,
            },
            criteria: {
                minAttendance: {
                    type: Number,
                    default: 80,
                    min: 0,
                    max: 100,
                },
                minAssignmentScore: {
                    type: Number,
                    default: 70,
                    min: 0,
                    max: 100,
                },
                minTestScore: {
                    type: Number,
                    default: 70,
                    min: 0,
                    max: 100,
                },
            },
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        enrollmentCount: {
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

// Generate slug from title
courseSchema.pre("save", function (next) {
    if (this.isModified("title")) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();
    }
    next();
});

// Indexes
courseSchema.index({ title: "text", description: "text" });
// Note: slug already has unique index from schema definition
courseSchema.index({ category: 1 });
courseSchema.index({ isPublished: 1 });

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
