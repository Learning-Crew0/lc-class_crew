const mongoose = require("mongoose");
const { ENROLLMENT_STATUSES } = require("../constants/statuses");

const attendanceSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  attended: {
    type: Boolean,
    default: false,
  },
  attendedAt: {
    type: Date,
  },
});

const assessmentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["assignment", "test", "quiz", "project"],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
  },
  maxScore: {
    type: Number,
    default: 100,
  },
  submittedAt: {
    type: Date,
  },
  gradedAt: {
    type: Date,
  },
});

const enrollmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ENROLLMENT_STATUSES),
      default: ENROLLMENT_STATUSES.ACTIVE,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
    attendance: [attendanceSchema],
    assessments: [assessmentSchema],
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    certificateIssued: {
      type: Boolean,
      default: false,
    },
    certificateIssuedAt: {
      type: Date,
    },
    certificateUrl: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound index to prevent duplicate enrollments
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });
enrollmentSchema.index({ status: 1 });

// Virtual for attendance percentage
enrollmentSchema.virtual("attendancePercentage").get(function () {
  if (!this.attendance || this.attendance.length === 0) return 0;
  const attended = this.attendance.filter((a) => a.attended).length;
  return Math.round((attended / this.attendance.length) * 100);
});

// Virtual for average assessment score
enrollmentSchema.virtual("averageScore").get(function () {
  if (!this.assessments || this.assessments.length === 0) return 0;
  const total = this.assessments.reduce((sum, assessment) => {
    const percentage = (assessment.score / assessment.maxScore) * 100;
    return sum + percentage;
  }, 0);
  return Math.round(total / this.assessments.length);
});

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

module.exports = Enrollment;
