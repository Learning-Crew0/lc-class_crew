const announcementService = require("../services/announcement.service");
const asyncHandler = require("../utils/asyncHandler.util");
const ApiError = require("../utils/apiError.util");
const { successResponse } = require("../utils/response.util");

const createAnnouncement = asyncHandler(async (req, res) => {
    if (!req.user || !req.user.id) {
        throw ApiError.unauthorized("Authentication required");
    }

    const announcement = await announcementService.createAnnouncement(
        req.body,
        req.files,
        req.user.id
    );
    return successResponse(
        res,
        announcement,
        "Announcement created successfully",
        201
    );
});

const getAllAnnouncements = asyncHandler(async (req, res) => {
    const result = await announcementService.getAllAnnouncements(req.query);
    return successResponse(res, result, "Announcements retrieved successfully");
});

const getAnnouncementById = asyncHandler(async (req, res) => {
    const incrementView = !req.user || req.user.role !== "admin";
    const announcement = await announcementService.getAnnouncementById(
        req.params.id,
        incrementView
    );
    return successResponse(
        res,
        announcement,
        "Announcement retrieved successfully"
    );
});

const updateAnnouncement = asyncHandler(async (req, res) => {
    if (!req.user || !req.user.id) {
        throw ApiError.unauthorized("Authentication required");
    }

    const announcement = await announcementService.updateAnnouncement(
        req.params.id,
        req.body,
        req.files,
        req.user.id
    );
    return successResponse(
        res,
        announcement,
        "Announcement updated successfully"
    );
});

const deleteAnnouncement = asyncHandler(async (req, res) => {
    const result = await announcementService.deleteAnnouncement(req.params.id);
    return successResponse(res, result, result.message);
});

const softDeleteAnnouncement = asyncHandler(async (req, res) => {
    const result = await announcementService.softDeleteAnnouncement(
        req.params.id
    );
    return successResponse(res, result, result.message);
});

const deleteAttachment = asyncHandler(async (req, res) => {
    const result = await announcementService.deleteAttachment(
        req.params.id,
        req.params.attachmentId
    );
    return successResponse(res, result, result.message);
});

const bulkDeleteAnnouncements = asyncHandler(async (req, res) => {
    const result = await announcementService.bulkDeleteAnnouncements(
        req.body.ids
    );
    return successResponse(res, result, result.message);
});

const getAnnouncementStats = asyncHandler(async (req, res) => {
    const stats = await announcementService.getAnnouncementStats();
    return successResponse(res, stats, "Statistics retrieved successfully");
});

module.exports = {
    createAnnouncement,
    getAllAnnouncements,
    getAnnouncementById,
    updateAnnouncement,
    deleteAnnouncement,
    softDeleteAnnouncement,
    deleteAttachment,
    bulkDeleteAnnouncements,
    getAnnouncementStats,
};
