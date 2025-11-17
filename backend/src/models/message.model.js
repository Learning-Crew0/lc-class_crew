const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            maxlength: [200, "Title cannot exceed 200 characters"],
        },
        message: {
            type: String,
            required: [true, "Message content is required"],
            trim: true,
            maxlength: [2000, "Message cannot exceed 2000 characters"],
        },
        courseName: {
            type: String,
            trim: true,
            maxlength: [200, "Course name cannot exceed 200 characters"],
        },
        type: {
            type: String,
            enum: ["auto", "manual", "system"],
            default: "manual",
        },
        triggerEvent: {
            type: String,
            trim: true,
            maxlength: [100, "Trigger event cannot exceed 100 characters"],
        },
        // Recipient configuration
        recipientType: {
            type: String,
            enum: ["single", "multiple", "all"],
            required: [true, "Recipient type is required"],
        },
        recipientUserIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        // Read tracking
        readBy: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                readAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        // Metadata
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: [true, "Creator is required"],
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

// Indexes for performance
messageSchema.index({ recipientUserIds: 1, createdAt: -1 });
messageSchema.index({ "readBy.userId": 1 });
messageSchema.index({ createdBy: 1 });
messageSchema.index({ isActive: 1 });
messageSchema.index({ type: 1 });

// Virtual for total recipients count
messageSchema.virtual("totalRecipients").get(function () {
    return this.recipientUserIds.length;
});

// Virtual for read count
messageSchema.virtual("readCount").get(function () {
    return this.readBy.length;
});

// Virtual for read rate
messageSchema.virtual("readRate").get(function () {
    if (this.totalRecipients === 0) return 0;
    return ((this.readBy.length / this.totalRecipients) * 100).toFixed(2);
});

// Method to check if a user has read the message
messageSchema.methods.isReadByUser = function (userId) {
    return this.readBy.some(
        (read) => read.userId.toString() === userId.toString()
    );
};

// Method to mark as read by a user
messageSchema.methods.markAsReadByUser = async function (userId) {
    if (!this.isReadByUser(userId)) {
        this.readBy.push({
            userId,
            readAt: new Date(),
        });
        await this.save();
    }
    return this;
};

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
