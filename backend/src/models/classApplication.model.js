const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        department: {
            type: String,
            trim: true,
        },
        position: {
            type: String,
            trim: true,
        },
    },
    { _id: false }
);

const classApplicationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        applicantName: {
            type: String,
            required: [true, "Applicant name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
        },
        organization: {
            type: String,
            trim: true,
        },
        memberType: {
            type: String,
            required: [true, "Member type is required"],
            enum: ["individual", "corporate_trainer", "employee", "job_seeker"],
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: [true, "Course is required"],
        },
        scheduleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TrainingSchedule",
            required: [true, "Schedule is required"],
        },
        courseName: {
            type: String,
            trim: true,
        },
        scheduleDate: {
            type: String,
            trim: true,
        },
        numberOfParticipants: {
            type: Number,
            default: 1,
            min: 1,
        },
        participants: [participantSchema],
        applicationPurpose: {
            type: String,
            trim: true,
        },
        specialRequests: {
            type: String,
            trim: true,
        },
        expectedPaymentMethod: {
            type: String,
            enum: [
                "simple_payment",
                "card_payment",
                "bank_transfer",
                "account_transfer",
            ],
        },
        paymentType: {
            type: String,
            enum: ["personal", "corporate"],
            default: "personal",
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected", "completed", "cancelled"],
            default: "pending",
        },
        applicationNumber: {
            type: String,
            unique: true,
        },
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
        },
        reviewedAt: {
            type: Date,
        },
        reviewNotes: {
            type: String,
            trim: true,
        },
        rejectionReason: {
            type: String,
            trim: true,
        },
        enrollmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Enrollment",
        },
        orderId: {
            type: String,
            trim: true,
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

classApplicationSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

classApplicationSchema.index({ userId: 1 });
classApplicationSchema.index({ courseId: 1 });
classApplicationSchema.index({ status: 1 });
classApplicationSchema.index({ createdAt: -1 });
classApplicationSchema.index({ applicationNumber: 1 });

classApplicationSchema.pre("save", async function (next) {
    if (!this.applicationNumber) {
        const count = await this.constructor.countDocuments();
        const date = new Date();
        const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
        this.applicationNumber = `APP-${dateStr}-${String(count + 1).padStart(5, "0")}`;
    }
    next();
});

const ClassApplication = mongoose.model(
    "ClassApplication",
    classApplicationSchema
);

module.exports = ClassApplication;
