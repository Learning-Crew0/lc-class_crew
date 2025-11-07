const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema(
    {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: [true, "Course reference is required"],
        },
        title: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        images: [
            {
                type: String,
                required: true,
            },
        ],
        isActive: {
            type: Boolean,
            default: true,
        },
        displayOrder: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

promotionSchema.index({ course: 1 });
promotionSchema.index({ isActive: 1, displayOrder: 1 });

const Promotion = mongoose.model("Promotion", promotionSchema);

module.exports = Promotion;
