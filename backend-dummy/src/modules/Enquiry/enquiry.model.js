const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: false 
    }, // if logged in
    name: { 
      type: String, 
      required: [true, "Name is required"] 
    },
    contact: {
      countryCode: { 
        type: String, 
        default: "82" 
      },
      phone: { 
        type: String, 
        required: [true, "Phone number is required"],
        match: [
          /^[0-9]{11}$/,
          "Please provide a valid 11-digit Korean phone number",
        ],
      },
    },
    email: { 
      type: String, 
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    company: { 
      type: String 
    },
    category: { 
      type: String, 
      required: [true, "Category is required"],
      enum: {
        values: [
          "Program Inquiry",
          "Payment Issue",
          "Technical Support",
          "General Question",
          "Partnership",
          "Other"
        ],
        message: "Please select a valid category"
      }
    }, // e.g. 'Program Inquiry', 'Payment Issue'
    subject: { 
      type: String, 
      required: [true, "Subject is required"],
      trim: true,
      maxlength: [200, "Subject cannot exceed 200 characters"]
    },
    message: { 
      type: String, 
      required: [true, "Message is required"],
      trim: true,
      minlength: [10, "Message must be at least 10 characters long"],
      maxlength: [2000, "Message cannot exceed 2000 characters"]
    },
    attachment: { 
      type: String 
    }, // file path or Cloudinary URL
    status: {
      type: String,
      enum: {
        values: ["pending", "in progress", "resolved"],
        message: "Status must be pending, in progress, or resolved"
      },
      default: "pending",
    },
    adminNote: { 
      type: String 
    }, // optional, for internal remarks
    agreeToTerms: { 
      type: Boolean, 
      default: false,
      validate: {
        validator: function (value) {
          return value === true;
        },
        message: "You must agree to the terms and conditions"
      }
    },
  },
  { 
    timestamps: true 
  }
);

// ==================== INDEXES ====================
enquirySchema.index({ userId: 1 });
enquirySchema.index({ status: 1 });
enquirySchema.index({ category: 1 });
enquirySchema.index({ createdAt: -1 });

// ==================== INSTANCE METHODS ====================
// Get public enquiry data (hide admin notes from users)
enquirySchema.methods.getPublicEnquiry = function () {
  const enquiryObject = this.toObject();
  delete enquiryObject.adminNote;
  delete enquiryObject.__v;
  return enquiryObject;
};

// ==================== STATIC METHODS ====================
// Find enquiries by user
enquirySchema.statics.findByUser = function (userId) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

// Find enquiries by status
enquirySchema.statics.findByStatus = function (status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

// Get enquiry statistics
enquirySchema.statics.getEnquiryStats = async function () {
  return await this.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);
};

const Enquiry = mongoose.model("Enquiry", enquirySchema);
module.exports = Enquiry;
