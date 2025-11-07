const mongoose = require("mongoose");

const instructorSchema = new mongoose.Schema(
    {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: [true, "Course reference is required"],
        },
        name: {
            type: String,
            required: [true, "Instructor name is required"],
            trim: true,
        },
        bio: {
            type: String,
            trim: true,
        },
        professionalField: {
            type: String,
            trim: true,
        },
        certificates: [
            {
                type: String,
                trim: true,
            },
        ],
        attendanceHistory: [
            {
                type: String,
                trim: true,
            },
        ],
        education: [
            {
                type: String,
                trim: true,
            },
        ],
        profileImage: {
            type: String,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

instructorSchema.index({ course: 1 });
instructorSchema.index({ name: 1 });

const Instructor = mongoose.model("Instructor", instructorSchema);

module.exports = Instructor;
