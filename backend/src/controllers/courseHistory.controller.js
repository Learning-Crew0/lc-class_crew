const courseHistoryService = require("../services/courseHistory.service");
const asyncHandler = require("../utils/asyncHandler.util");
const { successResponse } = require("../utils/response.util");

const getPersonalCourseHistory = asyncHandler(async (req, res) => {
    const result = await courseHistoryService.getPersonalCourseHistory(
        req.body
    );
    return successResponse(res, result, "Course history retrieved successfully");
});

const getCorporateCourseHistory = asyncHandler(async (req, res) => {
    const result = await courseHistoryService.getCorporateCourseHistory(
        req.body
    );
    return successResponse(res, result, "Course history retrieved successfully");
});

const requestCorporateVerification = asyncHandler(async (req, res) => {
    const result = await courseHistoryService.requestCorporateVerification(
        req.body
    );
    return successResponse(res, result, result.message);
});

const getCertificate = asyncHandler(async (req, res) => {
    const result = await courseHistoryService.getCertificate(req.params.enrollmentId);
    return successResponse(res, result, "Certificate retrieved successfully");
});

module.exports = {
    getPersonalCourseHistory,
    getCorporateCourseHistory,
    requestCorporateVerification,
    getCertificate,
};

