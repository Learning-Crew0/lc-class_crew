const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        content: {
            type: String,
            required: [true, "Content is required"],
        },
        type: {
            type: String,
            enum: ["info", "warning", "success", "error", "announcement"],
            default: "info",
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },
        targetAudience: {
            type: String,
            enum: ["all", "users", "students", "specific"],
            default: "all",
        },
        targetUsers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        publishedAt: {
            type: Date,
        },
        expiresAt: {
            type: Date,
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
        isPinned: {
            type: Boolean,
            default: false,
        },
        attachments: [
            {
                filename: String,
                url: String,
                fileType: String,
            },
        ],
        views: {
            type: Number,
            default: 0,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
noticeSchema.index({ isPublished: 1, publishedAt: -1 });
noticeSchema.index({ expiresAt: 1 });
noticeSchema.index({ targetAudience: 1 });

const Notice = mongoose.model("Notice", noticeSchema);

module.exports = Notice;
