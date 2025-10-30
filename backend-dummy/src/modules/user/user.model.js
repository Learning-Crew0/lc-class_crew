const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [30, "Username cannot exceed 30 characters"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false, // Don't return password in queries by default
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Full name must be at least 2 characters long"],
      maxlength: [100, "Full name cannot exceed 100 characters"],
    },
    gender: {
      type: String,
      enum: {
        values: ["남성", "여성"],
        message: "Gender must be 남성 or 여성",
      },
      required: [true, "Gender is required"],
    },
    memberType: {
      type: String,
      enum: {
        values: ["재직자", "기업교육담당자", "취업준비생"],
        message: "Member type must be 재직자, 기업교육담당자, or 취업준비생",
      },
      default: "취업준비생",
      required: [true, "Member type is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [
        /^[0-9]{11}$/,
        "Please provide a valid 11-digit Korean phone number",
      ],
    },
    dob: {
      type: Date,
      required: [true, "Date of birth is required"],
      validate: {
        validator: function (value) {
          return value < new Date();
        },
        message: "Date of birth must be in the past",
      },
    },
    profileImage: {
      type: String,
      default: null,
    },
    agreements: {
      termsOfService: {
        type: Boolean,
        required: [true, "You must agree to the terms of service"],
        validate: {
          validator: function (value) {
            return value === true;
          },
          message: "You must agree to the terms of service",
        },
      },
      privacyPolicy: {
        type: Boolean,
        required: [true, "You must agree to the privacy policy"],
        validate: {
          validator: function (value) {
            return value === true;
          },
          message: "You must agree to the privacy policy",
        },
      },
      marketingConsent: {
        type: Boolean,
        default: false,
      },
    },
    role: {
      type: String,
      enum: {
        values: ["user", "admin"],
        message: "Role must be user or admin",
      },
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true, // createdAt, updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ==================== INDEXES ====================
// Note: email and username already have unique: true which creates indexes automatically
userSchema.index({ memberType: 1 });
userSchema.index({ isActive: 1 });

// ==================== VIRTUALS ====================
// Calculate age from date of birth
userSchema.virtual("age").get(function () {
  if (!this.dob) return null;
  const ageDifMs = Date.now() - this.dob.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
});

// ==================== PRE-SAVE MIDDLEWARE ====================
// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  // Validate password strength before hashing
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(this.password)) {
    const error = new Error(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    );
    return next(error);
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Update lastLogin on save if it's being modified
userSchema.pre("save", function (next) {
  if (this.isModified("lastLogin")) {
    this.lastLogin = new Date();
  }
  next();
});

// ==================== INSTANCE METHODS ====================
// Compare entered password with stored hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Get public profile (exclude sensitive fields)
userSchema.methods.getPublicProfile = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.emailVerificationToken;
  delete userObject.emailVerificationExpires;
  delete userObject.passwordResetToken;
  delete userObject.passwordResetExpires;
  delete userObject.__v;
  return userObject;
};

// Generate email verification token
userSchema.methods.generateEmailVerificationToken = function () {
  const crypto = require("crypto");
  const token = crypto.randomBytes(32).toString("hex");
  this.emailVerificationToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  return token;
};

// Generate password reset token
userSchema.methods.generatePasswordResetToken = function () {
  const crypto = require("crypto");
  const token = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  return token;
};

// ==================== STATIC METHODS ====================
// Find active users
userSchema.statics.findActiveUsers = function () {
  return this.find({ isActive: true });
};

// Find by email (with password)
userSchema.statics.findByEmailWithPassword = function (email) {
  return this.findOne({ email }).select("+password");
};

// Find by username (with password)
userSchema.statics.findByUsernameWithPassword = function (username) {
  return this.findOne({ username }).select("+password");
};

// Get user statistics by member type
userSchema.statics.getUserStatsByMemberType = async function () {
  return await this.aggregate([
    {
      $group: {
        _id: "$memberType",
        count: { $sum: 1 },
        verified: {
          $sum: { $cond: [{ $eq: ["$isEmailVerified", true] }, 1, 0] },
        },
        active: {
          $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] },
        },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
