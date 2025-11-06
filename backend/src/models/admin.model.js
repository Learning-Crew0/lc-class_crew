const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            maxLength: 254,
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
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
        },
        role: {
            type: String,
            default: "admin",
            enum: ["admin", "superadmin"],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        lastLogin: {
            type: Date,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

adminSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

adminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

adminSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

adminSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

adminSchema.index({ username: 1 });
adminSchema.index({ createdAt: -1 });

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
