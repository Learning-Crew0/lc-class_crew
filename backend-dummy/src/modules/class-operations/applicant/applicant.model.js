const mongoose = require("mongoose");

const applicantSchema = new mongoose.Schema(
    {
        userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
        courseId: {type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true},
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        appliedAt: {type: Date, default: Date.now},
    }, {timestamps: true}
);

module.exports = mongoose.model("Applicant", applicantSchema);