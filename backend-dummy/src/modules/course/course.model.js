const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    tagColor: { type: String },
    tagText: { type: String },
    tags: [{ type: String }],
    processName: { type: String },
    shortDescription: { type: String },
    longDescription: { type: String },
    target: { type: String },
    duration: { type: String },
    location: { type: String },
    hours: { type: Number },
    price: { type: Number },
    priceText: { type: String },
    field: { type: String },
    date: { type: String },
    refundOptions: { type: String },
    learningGoals: [{ type: String }],
    mainImage: { type: String },
    noticeImage: { type: String },
    recommendedAudience: [{ type: String }],
    trainingSchedules: [
      {
        scheduleName: { type: String, required: true },
        startDate: { type: Date },
        endDate: { type: Date },
        status: {
          type: String,
          enum: ["upcoming", "ongoing", "completed", "cancelled"],
          default: "upcoming",
        },
        availableSeats: { type: Number },
        enrolledCount: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
      },
    ],
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
