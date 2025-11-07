const mongoose = require("mongoose");

const curriculumModuleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Module name is required"],
        trim: true,
    },
    content: {
        type: String,
        required: [true, "Module content is required"],
    },
    order: {
        type: Number,
        default: 0,
    },
});

const curriculumSchema = new mongoose.Schema(
    {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: [true, "Course reference is required"],
            unique: true,
        },
        keywords: [
            {
                type: String,
                trim: true,
            },
        ],
        modules: [curriculumModuleSchema],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

curriculumSchema.index({ course: 1 });

const Curriculum = mongoose.model("Curriculum", curriculumSchema);

module.exports = Curriculum;
