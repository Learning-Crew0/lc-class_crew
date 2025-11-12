const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
    {
        ticketNumber: {
            type: String,
            unique: true,
        },
        // User Info
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            maxlength: [100, "Name cannot exceed 100 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
        },
        phone: {
            type: String,
            required: [true, "Phone is required"],
            trim: true,
            match: [
                /^01[0-9]{9,10}$|^[6-9][0-9]{9}$|^91[6-9][0-9]{9}$|^82[0-9]{9,10}$|^\+?[0-9]{10,15}$/,
                "Phone must be valid format",
            ],
        },
        company: {
            type: String,
            trim: true,
            maxlength: [200, "Company name cannot exceed 200 characters"],
        },
        countryCode: {
            type: String,
            default: "82",
        },
        // Enquiry Details
        category: {
            type: String,
            required: [true, "Category is required"],
            enum: [
                "General Question",
                "Technical Support",
                "Program Inquiry",
                "Payment Issue",
                "Partnership",
                "Other",
            ],
        },
        subject: {
            type: String,
            required: [true, "Subject is required"],
            trim: true,
            maxlength: [200, "Subject cannot exceed 200 characters"],
        },
        message: {
            type: String,
            required: [true, "Message is required"],
            minlength: [10, "Message must be at least 10 characters"],
            maxlength: [2000, "Message cannot exceed 2000 characters"],
        },
        attachmentUrl: {
            type: String,
        },
        attachmentOriginalName: {
            type: String,
        },
        // Status
        status: {
            type: String,
            enum: ["pending", "in_progress", "resolved", "closed"],
            default: "pending",
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high", "urgent"],
            default: "medium",
        },
        // Assignment
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
        },
        // Response
        response: {
            message: String,
            respondedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Admin",
            },
            respondedByName: String,
            respondedAt: Date,
            attachments: [String],
        },
        // Consent
        agreeToTerms: {
            type: Boolean,
            required: [true, "Agreement to terms is required"],
            validate: {
                validator: function (v) {
                    return v === true;
                },
                message: "You must agree to the terms",
            },
        },
        // Tracking
        ipAddress: String,
        userAgent: String,
        // Notes (for admin use)
        notes: [
            {
                content: String,
                addedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Admin",
                },
                addedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        closedAt: Date,
    },
    {
        timestamps: true,
    }
);

// Auto-generate ticket number before saving
inquirySchema.pre("save", async function (next) {
    if (this.isNew && !this.ticketNumber) {
        const count = await mongoose.model("Inquiry").countDocuments();
        const year = new Date().getFullYear();
        this.ticketNumber = `ENQ-${year}-${String(count + 1).padStart(6, "0")}`;
    }
    next();
});

// Auto-set closedAt when status changes to closed
inquirySchema.pre("save", function (next) {
    if (
        this.isModified("status") &&
        this.status === "closed" &&
        !this.closedAt
    ) {
        this.closedAt = new Date();
    }
    next();
});

// Indexes
inquirySchema.index({ email: 1, phone: 1 });
inquirySchema.index({ status: 1, createdAt: -1 });
inquirySchema.index({ ticketNumber: 1 });
inquirySchema.index({ user: 1, createdAt: -1 });
inquirySchema.index({ category: 1 });

const Inquiry = mongoose.model("Inquiry", inquirySchema);

module.exports = Inquiry;
