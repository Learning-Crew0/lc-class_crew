const userService = require("../services/user.service");
const { successResponse } = require("../utils/response.util");
const asyncHandler = require("../utils/asyncHandler.util");

const getAllUsers = asyncHandler(async (req, res) => {
    const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        sortBy: req.query.sortBy || "createdAt",
        sortOrder: req.query.sortOrder || "desc",
        search: req.query.search,
        memberType: req.query.memberType,
        isActive:
            req.query.isActive === "true"
                ? true
                : req.query.isActive === "false"
                  ? false
                  : undefined,
    };

    const result = await userService.getAllUsers({}, options);
    return successResponse(res, result, "사용자 목록 조회 성공");
});

const getUserById = asyncHandler(async (req, res) => {
    const user = await userService.getUserById(req.params.id);
    return successResponse(res, user, "사용자 조회 성공");
});

const createUser = asyncHandler(async (req, res) => {
    const user = await userService.createUser(req.body);
    return successResponse(res, user, "사용자 생성 성공", 201);
});

const updateUser = asyncHandler(async (req, res) => {
    const user = await userService.updateUser(req.params.id, req.body);
    return successResponse(res, user, "사용자 수정 성공");
});

const deleteUser = asyncHandler(async (req, res) => {
    const result = await userService.deleteUser(req.params.id);
    return successResponse(res, result, "사용자 삭제 성공");
});

const toggleUserStatus = asyncHandler(async (req, res) => {
    const { isActive } = req.body;
    const user = await userService.toggleUserStatus(req.params.id, isActive);
    return successResponse(
        res,
        user,
        `사용자가 ${isActive ? "활성화" : "비활성화"}되었습니다`
    );
});

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
};
