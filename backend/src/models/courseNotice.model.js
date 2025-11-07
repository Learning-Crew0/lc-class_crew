const mongoose = require("mongoose");

const courseNoticeSchema = new mongoose.Schema(
    {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: [true, "Course reference is required"],
            unique: true,
        },
        title: {
            type: String,
            trim: true,
        },
        noticeImage: {
            type: String,
        },
        noticeDesc: {
            type: String,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        priority: {
            type: Number,
            default: 0,
        },
        expiresAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

courseNoticeSchema.index({ course: 1 });
courseNoticeSchema.index({ isActive: 1 });

const CourseNotice = mongoose.model("CourseNotice", courseNoticeSchema);

module.exports = CourseNotice;

