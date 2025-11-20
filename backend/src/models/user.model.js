const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const {
    MEMBERSHIP_TYPES,
    ALL_MEMBERSHIP_VALUES,
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
            match: [/^01[0-9]{9,10}$|^[6-9][0-9]{9}$|^91[6-9][0-9]{9}$|^82[0-9]{9,10}$|^\+?[0-9]{10,15}$/, "Phone must be valid format (01012345678, 9876543210, or 917879973266)"],
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
                    ...ALL_MEMBERSHIP_VALUES,
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

// Normalize Korean memberType to English before saving
userSchema.pre("save", function (next) {
    if (this.isModified("memberType")) {
        const { MEMBERSHIP_TYPES_KOREAN_MAP } = require("../constants/memberships");
        if (MEMBERSHIP_TYPES_KOREAN_MAP[this.memberType]) {
            this.memberType = MEMBERSHIP_TYPES_KOREAN_MAP[this.memberType];
        }
    }
    next();
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
