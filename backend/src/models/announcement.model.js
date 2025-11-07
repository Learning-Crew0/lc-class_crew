const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema(
    {
        filename: {
            type: String,
        },
        url: {
            type: String,
        },
        size: {
            type: Number,
        },
        mimeType: {
            type: String,
        },
        uploadedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: true }
);

const announcementSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            maxlength: 200,
        },
        content: {
            type: String,
            required: [true, "Content is required"],
            trim: true,
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            enum: ["notice", "event", "system", "urgent"],
            default: "notice",
        },
        tags: [
            {
                type: String,
                trim: true,
            },
        ],
        isNew: {
            type: Boolean,
            default: true,
        },
        isImportant: {
            type: Boolean,
            default: false,
        },
        isPinned: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: ["published", "draft", "archived"],
            default: "draft",
        },
        publishedAt: {
            type: Date,
        },
        expiresAt: {
            type: Date,
        },
        views: {
            type: Number,
            default: 0,
        },
        attachments: {
            type: [attachmentSchema],
            validate: {
                validator: function (v) {
                    return v.length <= 5;
                },
                message: "Maximum 5 attachments allowed",
            },
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
        },
        authorName: {
            type: String,
            required: true,
            trim: true,
        },
        lastModifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

announcementSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

announcementSchema.index({ category: 1 });
announcementSchema.index({ status: 1 });
announcementSchema.index({ isActive: 1 });
announcementSchema.index({ isPinned: -1, createdAt: -1 });
announcementSchema.index({ publishedAt: -1 });
announcementSchema.index({ title: "text", content: "text" });

announcementSchema.pre("save", function (next) {
    if (this.status === "published" && !this.publishedAt) {
        this.publishedAt = new Date();
    }

    if (this.publishedAt) {
        const daysSincePublish = Math.floor(
            (Date.now() - this.publishedAt.getTime()) / (1000 * 60 * 60 * 24)
        );
        this.isNew = daysSincePublish <= 7;
    }

    next();
});

const Announcement = mongoose.model("Announcement", announcementSchema);

module.exports = Announcement;

