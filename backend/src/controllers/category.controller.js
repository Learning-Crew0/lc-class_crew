const categoryService = require("../services/category.service");
const asyncHandler = require("../utils/asyncHandler.util");
const { successResponse } = require("../utils/response.util");

const getAllCategories = asyncHandler(async (req, res) => {
    const result = await categoryService.getAllCategories(req.query);
    return successResponse(res, result, "카테고리 목록을 성공적으로 조회했습니다");
});

const getCategoryById = asyncHandler(async (req, res) => {
    const category = await categoryService.getCategoryById(req.params.id);
    return successResponse(res, category, "카테고리 상세 정보를 성공적으로 조회했습니다");
});

const getCategoryWithCourses = asyncHandler(async (req, res) => {
    const category = await categoryService.getCategoryWithCourses(req.params.id);
    return successResponse(res, category, "카테고리와 코스 목록을 성공적으로 조회했습니다");
});

const createCategory = asyncHandler(async (req, res) => {
    const category = await categoryService.createCategory(req.body);
    return successResponse(res, category, "카테고리가 성공적으로 생성되었습니다", 201);
});

const updateCategory = asyncHandler(async (req, res) => {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    return successResponse(res, category, "카테고리가 성공적으로 업데이트되었습니다");
});

const deleteCategory = asyncHandler(async (req, res) => {
    const result = await categoryService.deleteCategory(req.params.id);
    return successResponse(res, result, result.message);
});

module.exports = {
    getAllCategories,
    getCategoryById,
    getCategoryWithCourses,
    createCategory,
    updateCategory,
    deleteCategory,
};

