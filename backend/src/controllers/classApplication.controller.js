const classApplicationService = require("../services/classApplication.service");
const asyncHandler = require("../utils/asyncHandler.util");
const { successResponse } = require("../utils/response.util");

const createClassApplication = asyncHandler(async (req, res) => {
    const userId = req.user?._id || null;
    const application = await classApplicationService.createClassApplication(
        req.body,
        userId
    );
    return successResponse(
        res,
        application,
        "Class application submitted successfully",
        201
    );
});

const getAllApplications = asyncHandler(async (req, res) => {
    const result = await classApplicationService.getAllApplications(req.query);
    return successResponse(
        res,
        result,
        "Applications retrieved successfully"
    );
});

const getApplicationById = asyncHandler(async (req, res) => {
    const application = await classApplicationService.getApplicationById(
        req.params.id
    );
    return successResponse(
        res,
        application,
        "Application retrieved successfully"
    );
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
    const application = await classApplicationService.updateApplicationStatus(
        req.params.id,
        req.body,
        req.user._id
    );
    return successResponse(
        res,
        application,
        "Application status updated successfully"
    );
});

const cancelApplication = asyncHandler(async (req, res) => {
    const application = await classApplicationService.cancelApplication(
        req.params.id,
        req.user._id
    );
    return successResponse(
        res,
        application,
        "Application cancelled successfully"
    );
});

const getUserApplications = asyncHandler(async (req, res) => {
    const result = await classApplicationService.getUserApplications(
        req.user._id,
        req.query
    );
    return successResponse(res, result, "User applications retrieved successfully");
});

const deleteApplication = asyncHandler(async (req, res) => {
    const result = await classApplicationService.deleteApplication(
        req.params.id
    );
    return successResponse(res, result, result.message);
});

module.exports = {
    createClassApplication,
    getAllApplications,
    getApplicationById,
    updateApplicationStatus,
    cancelApplication,
    getUserApplications,
    deleteApplication,
};

