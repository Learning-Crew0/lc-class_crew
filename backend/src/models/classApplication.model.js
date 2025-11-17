const mongoose = require("mongoose");

/**
 * Phone Number Schema
 * Format: { prefix: "010", middle: "1234", last: "5678" }
 */
const phoneSchema = new mongoose.Schema(
    {
        prefix: {
            type: String,
            required: true,
            enum: ["010", "011", "012", "013", "014", "015", "016", "017", "018", "019"],
        },
        middle: {
            type: String,
            required: false,
            match: /^\d{3,4}$/,
        },
        last: {
            type: String,
            required: false,
            match: /^\d{4}$/,
        },
    },
    { _id: false }
);

/**
 * Email Schema
 * Format: { username: "example", domain: "gmail.com" }
 */
const emailSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: false,
        },
        domain: {
            type: String,
            required: false,
        },
    },
    { _id: false }
);

/**
 * Student Schema
 * CRITICAL: Students MUST have existing user accounts (userId required)
 */
const studentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Student must have an existing user account"],
        },
        name: {
            type: String,
            required: [true, "Student name is required"],
        },
        phone: {
            type: phoneSchema,
            required: [true, "Student phone is required"],
        },
        email: {
            type: emailSchema,
            required: [true, "Student email is required"],
        },
        company: {
            type: String,
            trim: true,
        },
        position: {
            type: String,
            trim: true,
        },
    },
    { _id: true }
);

/**
 * Course Application Schema
 * Each selected course with its students
 */
const courseApplicationSchema = new mongoose.Schema(
    {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: [true, "Course reference is required"],
        },
        trainingSchedule: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TrainingSchedule",
            required: [true, "Training schedule is required"],
        },
        courseName: {
            type: String,
            required: true,
        },
        period: {
            type: String, // Format: "2025.09.14~2025.10.14"
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        discountedPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        // Students for this specific course (max 5 individual)
        students: {
            type: [studentSchema],
            validate: {
                validator: function (students) {
                    // If bulkUploadFile exists, students array should be empty or not validated
                    if (this.bulkUploadFile) {
                        return true;
                    }
                    // Allow empty for draft status
                    if (students.length === 0) {
                        return true;
                    }
                    // Individual entry: max 5 students
                    return students.length >= 1 && students.length <= 5;
                },
                message:
                    "Each course must have 1-5 students for individual entry, or use bulk upload for 6+ students",
            },
        },
        // For 6+ students: Excel file path
        bulkUploadFile: {
            type: String,
            trim: true,
        },
    },
    { _id: true }
);

/**
 * Payment Information Schema
 */
const paymentInfoSchema = new mongoose.Schema(
    {
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        paymentMethod: {
            type: String,
            required: [true, "Payment method is required"],
            enum: [
                "간편결제", // Simple payment
                "카드결제", // Card payment (NOT allowed for group)
                "계좌이체", // Bank transfer
                "무통장입금", // Bank deposit
                "카드현장결제", // On-site card payment
            ],
        },
        taxInvoiceRequired: {
            type: Boolean,
            default: false,
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "completed", "failed", "refunded"],
            default: "pending",
        },
        paymentDate: {
            type: Date,
        },
    },
    { _id: false }
);

/**
 * Invoice Manager Schema
 */
const invoiceManagerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Invoice manager name is required"],
        },
        phone: {
            type: phoneSchema,
            required: [true, "Invoice manager phone is required"],
        },
        email: {
            type: emailSchema,
            required: [true, "Invoice manager email is required"],
        },
    },
    { _id: false }
);

/**
 * Agreements Schema
 */
const agreementsSchema = new mongoose.Schema(
    {
        paymentAndRefundPolicy: {
            type: Boolean,
            required: true,
            validate: {
                validator: (v) => v === true,
                message: "Payment and refund policy must be accepted",
            },
        },
        refundPolicy: {
            type: Boolean,
            required: true,
            validate: {
                validator: (v) => v === true,
                message: "Refund policy must be accepted",
            },
        },
    },
    { _id: false }
);

/**
 * Class Application Main Schema
 */
const classApplicationSchema = new mongoose.Schema(
    {
        // Applicant
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User reference is required"],
        },

        // Application number (auto-generated)
        applicationNumber: {
            type: String,
            unique: true,
            sparse: true, // Allow null/undefined for drafts before submission
            default: null,
        },

        // Selected courses with students
        courses: {
            type: [courseApplicationSchema],
            required: true,
            validate: {
                validator: function (courses) {
                    return courses.length >= 1;
                },
                message: "At least one course must be selected",
            },
        },

        // Payment information
        paymentInfo: {
            type: paymentInfoSchema,
            required: [true, "Payment information is required"],
        },

        // Invoice manager
        invoiceManager: {
            type: invoiceManagerSchema,
            required: false, // Not required for draft
        },

        // Agreements
        agreements: {
            type: agreementsSchema,
            required: false, // Not required for draft
        },

        // Application status
        status: {
            type: String,
            enum: ["draft", "submitted", "confirmed", "cancelled", "completed"],
            default: "draft",
        },

        // Timestamps
        submittedAt: {
            type: Date,
        },
        confirmedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtual for ID
classApplicationSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

// Virtual for total students count
classApplicationSchema.virtual("totalStudents").get(function () {
    return this.courses.reduce((total, course) => {
        return total + (course.students?.length || 0);
    }, 0);
});

// Indexes
classApplicationSchema.index({ user: 1 });
classApplicationSchema.index({ applicationNumber: 1 });
classApplicationSchema.index({ status: 1 });
classApplicationSchema.index({ createdAt: -1 });

// Pre-save hook: Generate application number only when submitted
classApplicationSchema.pre("save", async function (next) {
    // Only generate application number when status changes to 'submitted'
    if (!this.applicationNumber && this.status === "submitted") {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        // Find count of applications today
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));

        const count = await this.constructor.countDocuments({
            createdAt: { $gte: startOfDay, $lte: endOfDay },
        });

        const sequence = String(count + 1).padStart(4, "0");
        this.applicationNumber = `APP-${year}${month}${day}-${sequence}`;
    }
    next();
});

// Pre-save validation: Payment method restriction for group applications
classApplicationSchema.pre("save", function (next) {
    const totalStudents = this.courses.reduce((total, course) => {
        return total + (course.students?.length || 0);
    }, 0);

    // Restrict online card payment for group applications (2+ students)
    if (totalStudents > 1 && this.paymentInfo?.paymentMethod === "카드결제") {
        const error = new Error(
            "대리, 단체 신청 시 온라인 신용카드 결제는 불가능합니다. 다른 결제 수단을 선택해주세요."
        );
        return next(error);
    }

    next();
});

const ClassApplication = mongoose.model(
    "ClassApplication",
    classApplicationSchema
);

module.exports = ClassApplication;
