const User = require("../models/user.model");
const Admin = require("../models/admin.model");
const { generateToken, generateRefreshToken } = require("../utils/crypto.util");
const ApiError = require("../utils/apiError.util");

const register = async (userData) => {
    if (userData.memberType === "admin" || userData.role === "admin") {
        throw ApiError.forbidden("Users cannot register as admin");
    }

    const existingEmail = await User.findOne({ email: userData.email });
    if (existingEmail) {
        throw ApiError.conflict("이미 등록된 이메일입니다");
    }

    const existingUsername = await User.findOne({
        username: userData.username,
    });
    if (existingUsername) {
        throw ApiError.conflict("이미 사용 중인 사용자 ID입니다");
    }

    const existingPhone = await User.findOne({ phone: userData.phone });
    if (existingPhone) {
        throw ApiError.conflict("이미 등록된 휴대전화 번호입니다");
    }

    const user = await User.create(userData);

    const token = generateToken({ id: user._id, role: "user" });
    const refreshToken = generateRefreshToken({ id: user._id, role: "user" });

    return {
        user: {
            _id: user._id,
            id: user._id,
            email: user.email,
            username: user.username,
            fullName: user.fullName,
            memberType: user.memberType,
            role: user.role,
        },
        token,
        refreshToken,
    };
};

const login = async (emailOrUsername, password) => {
    const user = await User.findOne({
        $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    }).select("+password");

    if (!user) {
        throw ApiError.unauthorized(
            "사용자 ID 또는 비밀번호가 올바르지 않습니다"
        );
    }

    if (!user.isActive) {
        throw ApiError.forbidden("비활성화된 계정입니다");
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw ApiError.unauthorized(
            "사용자 ID 또는 비밀번호가 올바르지 않습니다"
        );
    }

    user.lastLogin = Date.now();
    await user.save();

    const token = generateToken({ id: user._id, role: "user" });
    const refreshToken = generateRefreshToken({ id: user._id, role: "user" });

    return {
        user: {
            _id: user._id,
            id: user._id,
            email: user.email,
            username: user.username,
            fullName: user.fullName,
            gender: user.gender,
            phone: user.phone,
            dob: user.dob,
            memberType: user.memberType,
            role: user.role,
            isVerified: user.isVerified,
            profilePicture: user.profilePicture,
            createdAt: user.createdAt,
        },
        token,
        refreshToken,
    };
};

const adminLogin = async (identifier, password) => {
    const query = identifier.email
        ? { email: identifier.email }
        : { username: identifier.username };

    const admin = await Admin.findOne(query).select("+password");

    if (!admin) {
        throw ApiError.unauthorized("관리자 정보가 올바르지 않습니다");
    }

    if (!admin.isActive) {
        throw ApiError.forbidden("비활성화된 계정입니다");
    }

    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
        throw ApiError.unauthorized("관리자 정보가 올바르지 않습니다");
    }

    admin.lastLogin = Date.now();
    await admin.save();

    const token = generateToken({ id: admin._id, role: "admin" });
    const refreshToken = generateRefreshToken({ id: admin._id, role: "admin" });

    return {
        admin: {
            _id: admin._id,
            id: admin._id,
            email: admin.email,
            username: admin.username,
            fullName: admin.fullName,
            role: admin.role,
            isActive: admin.isActive,
            createdAt: admin.createdAt,
        },
        token,
        refreshToken,
    };
};

const getProfile = async (userId, role) => {
    let user;

    if (role === "admin") {
        user = await Admin.findById(userId);
    } else {
        user = await User.findById(userId);
    }

    if (!user) {
        throw ApiError.notFound("사용자를 찾을 수 없습니다");
    }

    return user;
};

const updateProfile = async (userId, updates) => {
    // Only restrict critical fields that should never be changed via profile update
    const restrictedFields = [
        "password", // Changed via changePassword endpoint only
        "email", // Cannot be changed (account identifier)
        "username", // Cannot be changed (login ID)
        "role", // Cannot be changed by user
    ];
    restrictedFields.forEach((field) => delete updates[field]);

    // Allow updates to: gender, memberType, phone, dob, agreements, fullName (optional)
    const user = await User.findByIdAndUpdate(userId, updates, {
        new: true,
        runValidators: true,
    });

    if (!user) {
        throw ApiError.notFound("사용자를 찾을 수 없습니다");
    }

    return user;
};

const changePassword = async (userId, currentPassword, newPassword, role) => {
    let user;

    if (role === "admin") {
        user = await Admin.findById(userId).select("+password");
    } else {
        user = await User.findById(userId).select("+password");
    }

    if (!user) {
        throw ApiError.notFound("사용자를 찾을 수 없습니다");
    }

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
        throw ApiError.badRequest("현재 비밀번호가 올바르지 않습니다");
    }

    if (currentPassword === newPassword) {
        throw ApiError.badRequest(
            "새 비밀번호는 현재 비밀번호와 달라야 합니다"
        );
    }

    user.password = newPassword;
    await user.save();

    return { message: "비밀번호가 성공적으로 변경되었습니다" };
};

/**
 * Verify member by phone, email, and name
 * Used for personal/corporate inquiry verification
 * @param {String} phone - User's phone number
 * @param {String} email - User's email
 * @param {String} name - User's full name
 * @returns {Object} Verification result
 */
const verifyMember = async (phone, email, name) => {
    // Normalize phone number (remove spaces, dashes, etc.)
    const normalizedPhone = phone.replace(/[\s-]/g, "");
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = name.trim();

    // Find user by phone and email
    const user = await User.findOne({
        $or: [
            { phone: normalizedPhone },
            { phoneNumber: normalizedPhone }, // Check both field names
        ],
    });

    // User not found (not a member)
    if (!user) {
        return {
            success: false,
            notFound: true,
        };
    }

    // Check if all information matches
    const emailMatch =
        user.email?.toLowerCase() === normalizedEmail;
    const nameMatch =
        user.fullName?.trim() === normalizedName || user.username?.trim() === normalizedName;

    // If info doesn't match
    if (!emailMatch || !nameMatch) {
        return {
            success: false,
            notFound: false, // User exists, but info doesn't match
        };
    }

    // All checks passed
    return {
        success: true,
    };
};

module.exports = {
    register,
    login,
    adminLogin,
    getProfile,
    updateProfile,
    changePassword,
    verifyMember,
};
