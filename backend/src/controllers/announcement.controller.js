const announcementService = require("../services/announcement.service");
const { successResponse } = require("../utils/response.util");

/**
 * Announcement Controller
 * Handles HTTP requests for announcement endpoints
 */

/**
 * Get all announcements (Public)
 * GET /api/v1/announcements
 */
const getAllAnnouncements = async (req, res, next) => {
    try {
        const { announcements, pagination } =
            await announcementService.getAllAnnouncements(req.query);

        return successResponse(
            res,
            { announcements, pagination },
            "공지사항을 성공적으로 조회했습니다"
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Get single announcement (Public)
 * GET /api/v1/announcements/:id
 */
const getAnnouncementById = async (req, res, next) => {
    try {
        const announcement = await announcementService.getAnnouncementById(
            req.params.id,
            true // Increment views
        );

        return successResponse(
            res,
            { announcement },
            "공지사항을 성공적으로 조회했습니다"
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Create announcement (Admin only)
 * POST /api/v1/admin/announcements
 */
const createAnnouncement = async (req, res, next) => {
    try {
        const announcement = await announcementService.createAnnouncement(
            req.body,
            req.user._id,
            req.files // Pass uploaded files
        );

        return successResponse(
            res,
            { announcement },
            "공지사항이 성공적으로 생성되었습니다",
            201
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Update announcement (Admin only)
 * PUT /api/v1/admin/announcements/:id
 */
const updateAnnouncement = async (req, res, next) => {
    try {
        const announcement = await announcementService.updateAnnouncement(
            req.params.id,
            req.body,
            req.user._id,
            req.files // Pass uploaded files
        );

        return successResponse(
            res,
            { announcement },
            "공지사항이 성공적으로 수정되었습니다"
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Delete announcement (Admin only)
 * DELETE /api/v1/admin/announcements/:id
 */
const deleteAnnouncement = async (req, res, next) => {
    try {
        await announcementService.deleteAnnouncement(req.params.id);

        return successResponse(
            res,
            null,
            "공지사항이 성공적으로 삭제되었습니다"
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Get announcement statistics (Admin only)
 * GET /api/v1/admin/announcements/stats
 */
const getStatistics = async (req, res, next) => {
    try {
        const stats = await announcementService.getStatistics();

        return successResponse(
            res,
            { stats },
            "통계를 성공적으로 조회했습니다"
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Toggle pin status (Admin only)
 * PATCH /api/v1/admin/announcements/:id/pin
 */
const togglePin = async (req, res, next) => {
    try {
        const announcement = await announcementService.togglePin(
            req.params.id,
            req.user._id
        );

        return successResponse(
            res,
            { announcement },
            `공지사항이 ${announcement.isPinned ? "고정" : "고정 해제"}되었습니다`
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Toggle active status (Admin only)
 * PATCH /api/v1/admin/announcements/:id/active
 */
const toggleActive = async (req, res, next) => {
    try {
        const announcement = await announcementService.toggleActive(
            req.params.id,
            req.user._id
        );

        return successResponse(
            res,
            { announcement },
            `공지사항이 ${announcement.isActive ? "활성화" : "비활성화"}되었습니다`
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Reorder pinned announcements
 * PATCH /api/v1/announcements/reorder-pinned
 */
const reorderPinnedAnnouncements = async (req, res, next) => {
    try {
        const { announcements } = req.body;

        if (!announcements || !Array.isArray(announcements)) {
            return res.status(400).json({
                success: false,
                message: "공지사항 배열이 필요합니다",
            });
        }

        const updatedAnnouncements =
            await announcementService.reorderPinnedAnnouncements(announcements);

        return successResponse(
            res,
            { announcements: updatedAnnouncements },
            "공지사항 순서가 변경되었습니다"
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Get pinned count
 * GET /api/v1/announcements/pinned-count
 */
const getPinnedCount = async (req, res, next) => {
    try {
        const pinnedInfo = await announcementService.getPinnedCount();

        return successResponse(res, pinnedInfo, "고정된 공지사항 수 조회 성공");
    } catch (error) {
        next(error);
    }
};

/**
 * Delete specific attachment from announcement
 * DELETE /api/v1/announcements/:id/attachments/:attachmentId
 */
const deleteAttachment = async (req, res, next) => {
    try {
        const { id, attachmentId } = req.params;

        const announcement = await announcementService.deleteAttachment(
            id,
            attachmentId,
            req.user._id
        );

        return successResponse(
            res,
            { announcement },
            "첨부파일이 삭제되었습니다"
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllAnnouncements,
    getAnnouncementById,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    getStatistics,
    togglePin,
    toggleActive,
    reorderPinnedAnnouncements,
    getPinnedCount,
    deleteAttachment,
};
