const authService = require("../services/auth.service");
const { successResponse } = require("../utils/response.util");
const asyncHandler = require("../utils/asyncHandler.util");

const register = asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);
    return successResponse(res, result, "회원가입이 완료되었습니다", 201);
});

const login = asyncHandler(async (req, res) => {
    const { emailOrUsername, password } = req.body;
    const result = await authService.login(emailOrUsername, password);
    return successResponse(res, result, "로그인 성공");
});

const adminLogin = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;
    const result = await authService.adminLogin({ email, username }, password);
    return successResponse(res, result, "관리자 로그인 성공");
});

const getProfile = asyncHandler(async (req, res) => {
    const user = await authService.getProfile(req.user.id, req.user.role);
    return successResponse(res, user, "프로필 조회 성공");
});

const updateProfile = asyncHandler(async (req, res) => {
    const user = await authService.updateProfile(req.user.id, req.body);
    return successResponse(res, user, "프로필 수정 성공");
});

const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const result = await authService.changePassword(
        req.user.id,
        currentPassword,
        newPassword,
        req.user.role
    );
    return successResponse(res, result, "비밀번호 변경 성공");
});

module.exports = {
    register,
    login,
    adminLogin,
    getProfile,
    updateProfile,
    changePassword,
};
