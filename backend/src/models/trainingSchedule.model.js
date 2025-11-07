const mongoose = require("mongoose");

const trainingScheduleSchema = new mongoose.Schema(
    {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: [true, "Course reference is required"],
        },
        scheduleName: {
            type: String,
            required: [true, "Schedule name is required"],
            trim: true,
        },
        startDate: {
            type: Date,
            required: [true, "Start date is required"],
        },
        endDate: {
            type: Date,
            required: [true, "End date is required"],
        },
        availableSeats: {
            type: Number,
            required: true,
            default: 30,
            min: 0,
        },
        enrolledCount: {
            type: Number,
            default: 0,
            min: 0,
        },
        status: {
            type: String,
            enum: ["upcoming", "ongoing", "completed", "cancelled"],
            default: "upcoming",
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

trainingScheduleSchema.virtual("remainingSeats").get(function () {
    return Math.max(0, this.availableSeats - this.enrolledCount);
});

trainingScheduleSchema.virtual("isFull").get(function () {
    return this.enrolledCount >= this.availableSeats;
});

trainingScheduleSchema.index({ course: 1, startDate: 1 });
trainingScheduleSchema.index({ status: 1 });
trainingScheduleSchema.index({ isActive: 1 });

const TrainingSchedule = mongoose.model(
    "TrainingSchedule",
    trainingScheduleSchema
);

module.exports = TrainingSchedule;
