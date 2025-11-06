const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
      trim: true,
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
    },
    category: {
      type: String,
      enum: [
        "general",
        "courses",
        "enrollment",
        "payments",
        "technical",
        "certificates",
        "other",
      ],
      default: "general",
    },
    order: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    helpful: {
      type: Number,
      default: 0,
    },
    notHelpful: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
faqSchema.index({ category: 1, order: 1 });
faqSchema.index({ isPublished: 1 });
faqSchema.index({ question: "text", answer: "text" });

const FAQ = mongoose.model("FAQ", faqSchema);

module.exports = FAQ;
