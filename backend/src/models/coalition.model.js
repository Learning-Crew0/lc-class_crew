const mongoose = require("mongoose");

/**
 * Coalition Application Schema
 * For partnership/collaboration applications (제휴 신청)
 */
const coalitionSchema = new mongoose.Schema(
    {
        // Basic Information
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters"],
            maxlength: [100, "Name cannot exceed 100 characters"],
        },
        affiliation: {
            type: String,
            required: [true, "Affiliation/Organization is required"],
            trim: true,
            minlength: [2, "Affiliation must be at least 2 characters"],
            maxlength: [200, "Affiliation cannot exceed 200 characters"],
        },
        field: {
            type: String,
            required: [true, "Field is required"],
            trim: true,
            minlength: [2, "Field must be at least 2 characters"],
            maxlength: [200, "Field cannot exceed 200 characters"],
        },

        // Contact Information
        contact: {
            type: String,
            required: [true, "Contact number is required"],
            trim: true,
            match: [
                /^01[0-1]\d{8}$/,
                "Contact number must be 11 digits (Korean format: 010XXXXXXXX)",
            ],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
            unique: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                "Please provide a valid email",
            ],
        },

        // File Upload
        file: {
            type: String,
            required: [true, "Profile/Reference file is required"],
        },
        fileOriginalName: {
            type: String,
        },

        // Application Status
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },

        // Admin Notes (Optional)
        adminNotes: {
            type: String,
            trim: true,
            maxlength: [1000, "Admin notes cannot exceed 1000 characters"],
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtual for ID
coalitionSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

// Indexes for performance
coalitionSchema.index({ email: 1 }, { unique: true });
coalitionSchema.index({ status: 1, createdAt: -1 });
coalitionSchema.index({ createdAt: -1 });
coalitionSchema.index({ affiliation: 1 });
coalitionSchema.index({ field: 1 });

// Pre-save hook to handle email uniqueness error
coalitionSchema.post("save", function (error, doc, next) {
    if (error.name === "MongoServerError" && error.code === 11000) {
        if (error.keyPattern.email) {
            next(new Error("An application with this email already exists"));
        } else {
            next(error);
        }
    } else {
        next(error);
    }
});

const Coalition = mongoose.model("Coalition", coalitionSchema);

module.exports = Coalition;
