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
        // 학력 및 경력 (Education and Career)
        education: [
            {
                type: String,
                trim: true,
            },
        ],
        // 전문분야 (Professional Expertise)
        expertise: [
            {
                type: String,
                trim: true,
            },
        ],
        // 자격 및 저서 (Certificates and Publications)
        certificates: [
            {
                type: String,
                trim: true,
            },
        ],
        // 출강이력 (Teaching Experience/Attendance History)
        experience: [
            {
                type: String,
                trim: true,
            },
        ],
        // Legacy field - kept for backward compatibility
        attendanceHistory: [
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
