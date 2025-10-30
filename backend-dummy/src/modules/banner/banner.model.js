const mongoose = require("mongoose");

const BannerSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  headline: { type: String },
  subText: { type: String },
  mainText: { type: String },
  buttonText: { type: String },
  linkUrl: { type: String },
  displayPeriod: {
    start: { type: Date },
    end: { type: Date }
  },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Banner", BannerSchema);
