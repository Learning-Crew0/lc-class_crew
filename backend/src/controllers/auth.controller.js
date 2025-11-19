const authService = require("../services/auth.service");
const { successResponse } = require("../utils/response.util");
const asyncHandler = require("../utils/asyncHandler.util");
const ApiError = require("../utils/apiError.util");

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

/**
 * Verify member by phone, email, and name
 * Used for personal/corporate inquiry verification
 */
const verifyMember = asyncHandler(async (req, res) => {
    const { phone, email, name } = req.body;

    if (!phone || !email || !name) {
        return res.status(400).json({
            status: "error",
            message: "Phone, email, and name are required",
        });
    }

    const result = await authService.verifyMember(phone, email, name);

    if (result.success) {
        return res.status(200).json({
            status: "success",
            success: true,
            message: "Member verified",
        });
    } else if (result.notFound) {
        return res.status(404).json({
            status: "error",
            message: "가입되어 있지 않습니다",
        });
    } else {
        return res.status(400).json({
            status: "error",
            message: "일치하지 않습니다",
        });
    }
});

const refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
        throw ApiError.badRequest("리프레시 토큰이 필요합니다");
    }
    
    const result = await authService.refreshAccessToken(refreshToken);
    return successResponse(res, result, "토큰이 갱신되었습니다");
});

const verifyToken = asyncHandler(async (req, res) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw ApiError.badRequest("토큰이 필요합니다");
    }
    
    const token = authHeader.split(" ")[1];
    const result = await authService.verifyAccessToken(token);
    
    return successResponse(res, result, "토큰 검증 완료");
});

module.exports = {
    register,
    login,
    adminLogin,
    getProfile,
    updateProfile,
    changePassword,
    verifyMember,
    refreshToken,
    verifyToken,
};
