const mongoose = require("mongoose");

const attendanceRecordSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    attended: {
        type: Boolean,
        default: false,
    },
    duration: {
        type: Number,
    },
});

const enrollmentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User reference is required"],
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: [true, "Course reference is required"],
        },
        schedule: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TrainingSchedule",
            required: [true, "Training schedule reference is required"],
        },
        enrollmentDate: {
            type: Date,
            default: Date.now,
        },
        enrollmentNumber: {
            type: String,
            unique: true,
        },
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "pending",
        },
        amountPaid: {
            type: Number,
            required: true,
            min: 0,
        },
        paymentMethod: {
            type: String,
            enum: ["card", "bank_transfer", "cash", "other"],
        },
        status: {
            type: String,
            enum: ["수강예정", "수강중", "수료", "미수료", "취소"],
            default: "수강예정",
        },
        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        startedAt: {
            type: Date,
        },
        completedAt: {
            type: Date,
        },
        lastAccessedAt: {
            type: Date,
        },
        certificateEligible: {
            type: Boolean,
            default: false,
        },
        certificateIssued: {
            type: Boolean,
            default: false,
        },
        certificateUrl: {
            type: String,
        },
        certificateIssuedAt: {
            type: Date,
        },
        attendanceRecords: [attendanceRecordSchema],
        courseRating: {
            type: Number,
            min: 1,
            max: 5,
        },
        review: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CourseReview",
        },
        refundRequested: {
            type: Boolean,
            default: false,
        },
        refundStatus: {
            type: String,
            enum: ["pending", "approved", "rejected", "completed"],
        },
        refundAmount: {
            type: Number,
            min: 0,
        },
        refundDate: {
            type: Date,
        },
        refundReason: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

enrollmentSchema.virtual("attendancePercentage").get(function () {
    if (!this.attendanceRecords || this.attendanceRecords.length === 0)
        return 0;
    const attended = this.attendanceRecords.filter((a) => a.attended).length;
    return Math.round((attended / this.attendanceRecords.length) * 100);
});

enrollmentSchema.pre("save", async function (next) {
    if (this.isNew && !this.enrollmentNumber) {
        const count = await mongoose.model("Enrollment").countDocuments();
        this.enrollmentNumber = `ENR-${Date.now()}-${String(count + 1).padStart(5, "0")}`;
    }
    next();
});

enrollmentSchema.index({ user: 1, course: 1, schedule: 1 }, { unique: true });
enrollmentSchema.index({ user: 1 });
enrollmentSchema.index({ course: 1 });
enrollmentSchema.index({ schedule: 1 });
enrollmentSchema.index({ status: 1 });
enrollmentSchema.index({ enrollmentDate: -1 });

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

module.exports = Enrollment;
