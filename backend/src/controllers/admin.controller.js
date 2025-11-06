const adminService = require("../services/admin.service");
const authService = require("../services/auth.service");
const { successResponse } = require("../utils/response.util");
const asyncHandler = require("../utils/asyncHandler.util");

const login = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;
    const result = await authService.adminLogin({ email, username }, password);
    return successResponse(res, result, "관리자 로그인 성공");
});

const getProfile = asyncHandler(async (req, res) => {
    const admin = await authService.getProfile(req.user.id, req.user.role);
    return successResponse(res, { admin }, "관리자 프로필 조회 성공");
});

const getAllAdmins = asyncHandler(async (req, res) => {
    const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        sortBy: req.query.sortBy || "createdAt",
        sortOrder: req.query.sortOrder || "desc",
    };

    const result = await adminService.getAllAdmins(options);
    return successResponse(res, result, "관리자 목록 조회 성공");
});

const getAdminById = asyncHandler(async (req, res) => {
    const admin = await adminService.getAdminById(req.params.id);
    return successResponse(res, { admin }, "관리자 조회 성공");
});

const createAdmin = asyncHandler(async (req, res) => {
    const admin = await adminService.createAdmin(req.body);
    return successResponse(res, { admin }, "관리자 생성 성공", 201);
});

const updateAdmin = asyncHandler(async (req, res) => {
    const admin = await adminService.updateAdmin(req.params.id, req.body);
    return successResponse(res, { admin }, "관리자 수정 성공");
});

const deleteAdmin = asyncHandler(async (req, res) => {
    const result = await adminService.deleteAdmin(req.params.id, req.user.id);
    return successResponse(res, result, "관리자 삭제 성공");
});

const updateAdminStatus = asyncHandler(async (req, res) => {
    const { isActive } = req.body;
    const admin = await adminService.updateAdminStatus(
        req.params.id,
        isActive,
        req.user.id
    );
    return successResponse(
        res,
        { admin },
        `관리자가 ${isActive ? "활성화" : "비활성화"}되었습니다`
    );
});

const updateAdminPassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const result = await adminService.updateAdminPassword(
        req.user.id,
        currentPassword,
        newPassword
    );
    return successResponse(res, result, "비밀번호 변경 성공");
});

module.exports = {
    login,
    getProfile,
    getAllAdmins,
    getAdminById,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    updateAdminStatus,
    updateAdminPassword,
};
