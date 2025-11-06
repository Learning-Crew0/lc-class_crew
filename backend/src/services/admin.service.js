const Admin = require("../models/admin.model");
const ApiError = require("../utils/apiError.util");

const getAllAdmins = async (options = {}) => {
    const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
    } = options;

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    const [admins, total] = await Promise.all([
        Admin.find().sort(sort).skip(skip).limit(limit).lean(),
        Admin.countDocuments(),
    ]);

    return {
        admins,
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalAdmins: total,
            limit: parseInt(limit),
        },
    };
};

const getAdminById = async (adminId) => {
    const admin = await Admin.findById(adminId);

    if (!admin) {
        throw ApiError.notFound("관리자를 찾을 수 없습니다");
    }

    return admin;
};

const createAdmin = async (adminData) => {
    const existingEmail = await Admin.findOne({ email: adminData.email });
    if (existingEmail) {
        throw ApiError.conflict("이미 등록된 이메일입니다");
    }

    const existingUsername = await Admin.findOne({
        username: adminData.username,
    });
    if (existingUsername) {
        throw ApiError.conflict("이미 사용 중인 사용자명입니다");
    }

    const admin = await Admin.create(adminData);
    return admin;
};

const updateAdmin = async (adminId, updates) => {
    const restrictedFields = ["password", "role", "username"];
    restrictedFields.forEach((field) => delete updates[field]);

    if (updates.email) {
        const existingEmail = await Admin.findOne({
            email: updates.email,
            _id: { $ne: adminId },
        });
        if (existingEmail) {
            throw ApiError.conflict("이미 등록된 이메일입니다");
        }
    }

    const admin = await Admin.findByIdAndUpdate(adminId, updates, {
        new: true,
        runValidators: true,
    });

    if (!admin) {
        throw ApiError.notFound("관리자를 찾을 수 없습니다");
    }

    return admin;
};

const deleteAdmin = async (adminId, currentAdminId) => {
    if (adminId === currentAdminId) {
        throw ApiError.badRequest("자신의 계정을 삭제할 수 없습니다");
    }

    const admin = await Admin.findByIdAndDelete(adminId);

    if (!admin) {
        throw ApiError.notFound("관리자를 찾을 수 없습니다");
    }

    return { message: "관리자가 성공적으로 삭제되었습니다" };
};

const updateAdminStatus = async (adminId, isActive, currentAdminId) => {
    if (adminId === currentAdminId) {
        throw ApiError.badRequest("자신의 계정 상태를 변경할 수 없습니다");
    }

    const admin = await Admin.findByIdAndUpdate(
        adminId,
        { isActive },
        { new: true }
    );

    if (!admin) {
        throw ApiError.notFound("관리자를 찾을 수 없습니다");
    }

    return admin;
};

const updateAdminPassword = async (adminId, currentPassword, newPassword) => {
    const admin = await Admin.findById(adminId).select("+password");

    if (!admin) {
        throw ApiError.notFound("관리자를 찾을 수 없습니다");
    }

    const isPasswordValid = await admin.comparePassword(currentPassword);
    if (!isPasswordValid) {
        throw ApiError.badRequest("현재 비밀번호가 올바르지 않습니다");
    }

    if (currentPassword === newPassword) {
        throw ApiError.badRequest(
            "새 비밀번호는 현재 비밀번호와 달라야 합니다"
        );
    }

    admin.password = newPassword;
    await admin.save();

    return { message: "비밀번호가 성공적으로 변경되었습니다" };
};

module.exports = {
    getAllAdmins,
    getAdminById,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    updateAdminStatus,
    updateAdminPassword,
};
