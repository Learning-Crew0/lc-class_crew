const User = require("../models/user.model");
const Admin = require("../models/admin.model");
const { generateToken, generateRefreshToken } = require("../utils/crypto.util");
const ApiError = require("../utils/apiError.util");

const register = async (userData) => {
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
    const restrictedFields = [
        "password",
        "email",
        "username",
        "role",
        "memberType",
        "agreements",
    ];
    restrictedFields.forEach((field) => delete updates[field]);

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

module.exports = {
    register,
    login,
    adminLogin,
    getProfile,
    updateProfile,
    changePassword,
};
