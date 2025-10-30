const mongoose = require("mongoose");

const ThumbnailSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  category: { type: String, enum: ["NEWEST", "POPULAR", "ALL"], required: true },
  tags: [{ type: String }],
  level: { type: String },
  instructor: { type: String },
  schedule: { type: String },
  price: { type: Number },
  buttonText: { type: String, default: "View" },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Thumbnail", ThumbnailSchema);
