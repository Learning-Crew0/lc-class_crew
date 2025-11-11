const mongoose = require("mongoose");

const passwordResetTokenSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        token: {
            type: String,
            default: null,
        },
        verificationCode: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        isUsed: {
            type: Boolean,
            default: false,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        attempts: {
            type: Number,
            default: 0,
            max: 5,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
passwordResetTokenSchema.index({ userId: 1 });
passwordResetTokenSchema.index({ token: 1 });
passwordResetTokenSchema.index({ phoneNumber: 1 });

// TTL index - automatically delete expired tokens
passwordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("PasswordResetToken", passwordResetTokenSchema);

