const mongoose = require("mongoose");

/**
 * Attendance Record Schema
 */
const attendanceRecordSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ["present", "absent", "late"],
            required: true,
        },
        notes: {
            type: String,
            trim: true,
        },
    },
    { _id: true }
);

/**
 * Student Enrollment Schema
 * Links students to courses through class applications
 */
const studentEnrollmentSchema = new mongoose.Schema(
    {
        // References
        classApplication: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ClassApplication",
            required: [true, "Class application reference is required"],
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: [true, "Course reference is required"],
        },
        trainingSchedule: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TrainingSchedule",
            required: [true, "Training schedule reference is required"],
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Student reference is required"],
        },
        
        // Enrollment status
        enrollmentStatus: {
            type: String,
            enum: ["enrolled", "completed", "cancelled", "no-show"],
            default: "enrolled",
        },
        
        // Attendance tracking
        attendanceRecords: {
            type: [attendanceRecordSchema],
            default: [],
        },
        
        // Certificate information
        certificateIssued: {
            type: Boolean,
            default: false,
        },
        certificateIssuedDate: {
            type: Date,
        },
        certificateUrl: {
            type: String,
            trim: true,
        },
        
        // Completion tracking
        completionDate: {
            type: Date,
        },
        completionPercentage: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },
        
        // Cancellation
        cancellationReason: {
            type: String,
            trim: true,
        },
        cancelledAt: {
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
studentEnrollmentSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

// Virtual for attendance rate
studentEnrollmentSchema.virtual("attendanceRate").get(function () {
    if (this.attendanceRecords.length === 0) {
        return 0;
    }
    
    const presentCount = this.attendanceRecords.filter(
        (record) => record.status === "present"
    ).length;
    
    return (presentCount / this.attendanceRecords.length) * 100;
});

// Indexes
studentEnrollmentSchema.index({ classApplication: 1 });
studentEnrollmentSchema.index({ course: 1 });
studentEnrollmentSchema.index({ student: 1 });
studentEnrollmentSchema.index({ enrollmentStatus: 1 });
studentEnrollmentSchema.index({ createdAt: -1 });

// Compound index for unique enrollment
studentEnrollmentSchema.index(
    { student: 1, course: 1, trainingSchedule: 1 },
    { unique: true }
);

const StudentEnrollment = mongoose.model(
    "StudentEnrollment",
    studentEnrollmentSchema
);

module.exports = StudentEnrollment;

