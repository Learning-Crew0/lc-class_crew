const mongoose = require("mongoose");

const coalitionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    affiliation: {
      type: String,
      required: [true, "Affiliation is required"],
    },
    field: {
      type: String,
      required: [true, "Field is required"],
    },
    contact: {
      type: String,
      required: [true, "Contact number is required"],
      match: [/^[0-9]{11}$/, "Please provide a valid 11-digit Korean phone number"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    file: {
      type: String, // File path (local or cloud)
      required: [true, "Profile/Reference file is required"],
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "approved", "rejected"],
      default: "pending",
    },
    adminNote: {
      type: String,
    },
  },
  { timestamps: true }
);

// Index for efficient queries
coalitionSchema.index({ status: 1 });
coalitionSchema.index({ email: 1 });
coalitionSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Coalition", coalitionSchema);

