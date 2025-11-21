const mongoose = require("mongoose");

/**
 * Announcement Schema
 * 공지사항 (Announcements/Notices)
 */
const announcementSchema = new mongoose.Schema(
    {
        // Auto-incrementing ID for display
        id: {
            type: Number,
            unique: true,
        },

        // Title (Korean)
        title: {
            type: String,
            required: [true, "제목을 입력해주세요"],
            trim: true,
            maxlength: [200, "제목은 200자 이내로 입력해주세요"],
        },

        // Content (HTML supported)
        content: {
            type: String,
            required: [true, "내용을 입력해주세요"],
            trim: true,
            minlength: [10, "내용은 최소 10자 이상 입력해주세요"],
        },

        // Pin to top of list
        isPinned: {
            type: Boolean,
            default: false,
        },

        // Order of pinned announcements (lower number = higher priority)
        pinnedOrder: {
            type: Number,
            default: 0,
            min: 0,
        },

        // Active status
        isActive: {
            type: Boolean,
            default: true,
        },

        // File attachments (images, PDFs, Excel files)
        attachments: [
            {
                fileName: {
                    type: String,
                    required: true,
                },
                fileUrl: {
                    type: String,
                    required: true,
                },
                fileType: {
                    type: String,
                    enum: ["image", "pdf", "excel"],
                    required: true,
                },
                fileSize: {
                    type: Number,
                    required: true,
                },
            },
        ],

        // View count
        views: {
            type: Number,
            default: 0,
            min: 0,
        },

        // Admin who created
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "생성자 정보가 필요합니다"],
        },

        // Last admin who updated
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtual field: isRecent (created within last 30 days / 1 month)
// Note: Renamed from 'isNew' to avoid conflict with Mongoose's built-in isNew property
announcementSchema.virtual("isRecent").get(function () {
    if (!this.createdAt) return false;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return this.createdAt >= thirtyDaysAgo;
});

// Auto-increment ID before validating
announcementSchema.pre("validate", async function (next) {
    // Only auto-increment for new documents that don't have an id yet
    if (!this.id && this.isNew) {
        try {
            const lastAnnouncement = await this.constructor
                .findOne()
                .sort({ id: -1 })
                .select("id")
                .lean()
                .exec();

            if (lastAnnouncement && typeof lastAnnouncement.id === "number") {
                this.id = lastAnnouncement.id + 1;
            } else {
                this.id = 1;
            }
        } catch (error) {
            console.error("Error in auto-increment:", error);
            return next(error);
        }
    }
    next();
});

// Indexes for performance
announcementSchema.index({ createdAt: -1 });
announcementSchema.index({ isPinned: -1, pinnedOrder: 1, createdAt: -1 }); // Pinned first (by order), then by date
announcementSchema.index({ isActive: 1, createdAt: -1 });
announcementSchema.index({ id: 1 }, { unique: true });
announcementSchema.index({ title: "text", content: "text" }); // Text search

const Announcement = mongoose.model("Announcement", announcementSchema);

module.exports = Announcement;
