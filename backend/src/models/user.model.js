const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const {
    MEMBERSHIP_TYPES,
    USER_ROLES,
    GENDER_TYPES,
} = require("../constants/memberships");

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            maxLength: 254,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                "Please provide a valid email",
            ],
        },
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            trim: true,
            minLength: [3, "Username must be at least 3 characters"],
            maxLength: [50, "Username cannot exceed 50 characters"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters"],
            maxLength: 128,
            select: false,
        },
        fullName: {
            type: String,
            required: [true, "Full name is required"],
            trim: true,
            minLength: [2, "Name must be at least 2 characters"],
            maxLength: [100, "Name cannot exceed 100 characters"],
        },
        gender: {
            type: String,
            required: [true, "Gender is required"],
            enum: {
                values: Object.values(GENDER_TYPES),
                message: "Gender must be 남성 or 여성",
            },
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            unique: true,
            trim: true,
            match: [/^01[0-9]{9}$|^[6-9][0-9]{9}$|^\+?[0-9]{10,15}$/, "Phone must be valid Korean (01012345678) or Indian (9876543210) format"],
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
        memberType: {
            type: String,
            required: [true, "Member type is required"],
            enum: {
                values: [
                    MEMBERSHIP_TYPES.EMPLOYED,
                    MEMBERSHIP_TYPES.CORPORATE_TRAINING_MANAGER,
                    MEMBERSHIP_TYPES.JOB_SEEKER,
                    MEMBERSHIP_TYPES.ADMIN,
                ],
                message: "Invalid member type",
            },
        },
        role: {
            type: String,
            enum: Object.values(USER_ROLES),
            default: USER_ROLES.USER,
        },
        agreements: {
            termsOfService: {
                type: Boolean,
                required: [true, "Terms of service agreement is required"],
                validate: {
                    validator: function (v) {
                        return v === true;
                    },
                    message: "You must agree to terms of service",
                },
            },
            privacyPolicy: {
                type: Boolean,
                required: [true, "Privacy policy agreement is required"],
                validate: {
                    validator: function (v) {
                        return v === true;
                    },
                    message: "You must agree to privacy policy",
                },
            },
            marketingConsent: {
                type: Boolean,
                default: false,
            },
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        lastLogin: {
            type: Date,
        },
        profilePicture: {
            type: String,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

userSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

userSchema.index({ memberType: 1 });
userSchema.index({ createdAt: -1 });

const User = mongoose.model("User", userSchema);

module.exports = User;
