const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      enum: ["general", "email", "payment", "security", "features", "other"],
      default: "general",
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
settingsSchema.index({ key: 1 });
settingsSchema.index({ category: 1 });

const Settings = mongoose.model("Settings", settingsSchema);

module.exports = Settings;
