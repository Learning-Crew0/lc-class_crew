const Announcement = require("../models/announcement.model");
const ApiError = require("../utils/apiError.util");
const {
    getPaginationParams,
    createPaginationMeta,
} = require("../utils/pagination.util");
const { getFileUrl, deleteFileByUrl } = require("../config/fileStorage");

/**
 * Announcement Service
 * Handles business logic for announcements
 */

/**
 * Get all announcements with pagination and filters
 */
const getAllAnnouncements = async (query) => {
    const { page, limit, skip } = getPaginationParams(query);

    const filter = {};

    // Filter by active status (default: true for public)
    if (query.isActive !== undefined) {
        filter.isActive = query.isActive === "true" || query.isActive === true;
    } else {
        // Default: only show active announcements to public
        filter.isActive = true;
    }

    // Search in title and content
    if (query.search) {
        filter.$text = { $search: query.search };
    }

    // Sorting
    let sortField = query.sort || "-createdAt";

    // Custom sort for pinned items first (by pinnedOrder), then regular items
    const sortOptions = {};
    if (sortField === "-createdAt" || sortField === "createdAt") {
        sortOptions.isPinned = -1; // Pinned first
        sortOptions.pinnedOrder = 1; // Lower order number = higher priority
        sortOptions.createdAt = sortField === "-createdAt" ? -1 : 1;
    } else if (sortField === "-views" || sortField === "views") {
        sortOptions.isPinned = -1;
        sortOptions.pinnedOrder = 1;
        sortOptions.views = sortField === "-views" ? -1 : 1;
        sortOptions.createdAt = -1; // Secondary sort
    } else if (sortField === "-title" || sortField === "title") {
        sortOptions.isPinned = -1;
        sortOptions.pinnedOrder = 1;
        sortOptions.title = sortField === "-title" ? -1 : 1;
    }

    const announcements = await Announcement.find(filter)
        .populate("createdBy", "fullName email")
        .populate("updatedBy", "fullName email")
        .select("-__v")
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean({ virtuals: true });

    const total = await Announcement.countDocuments(filter);

    return {
        announcements,
        pagination: createPaginationMeta(page, limit, total),
    };
};

/**
 * Get single announcement by ID and increment view count
 */
const getAnnouncementById = async (announcementId, incrementViews = true) => {
    const announcement = await Announcement.findById(announcementId)
        .populate("createdBy", "fullName email")
        .populate("updatedBy", "fullName email")
        .select("-__v");

    if (!announcement) {
        throw ApiError.notFound("공지사항을 찾을 수 없습니다");
    }

    // Increment view count
    if (incrementViews) {
        announcement.views += 1;
        await announcement.save();
    }

    return announcement;
};

/**
 * Create new announcement (Admin only)
 */
const createAnnouncement = async (data, adminId, files = null) => {
    // Check pin limit (max 2 pinned announcements)
    if (data.isPinned === true || data.isPinned === "true") {
        const pinnedCount = await Announcement.countDocuments({
            isPinned: true,
        });

        if (pinnedCount >= 2) {
            throw ApiError.badRequest(
                "최대 2개까지만 고정할 수 있습니다. 다른 공지사항의 고정을 해제한 후 시도해주세요."
            );
        }

        // Set pinnedOrder for new pinned announcements
        const maxOrder = await Announcement.findOne({ isPinned: true })
            .sort({ pinnedOrder: -1 })
            .select("pinnedOrder");

        data.pinnedOrder = maxOrder ? maxOrder.pinnedOrder + 1 : 0;
    }

    // Handle file uploads
    const attachments = [];
    if (files && files.length > 0) {
        for (const file of files) {
            let fileType = "pdf";
            if (file.mimetype.startsWith("image/")) {
                fileType = "image";
            } else if (
                file.mimetype.includes("excel") ||
                file.mimetype.includes("spreadsheet")
            ) {
                fileType = "excel";
            }

            attachments.push({
                fileName: file.originalname,
                fileUrl: getFileUrl("ANNOUNCEMENTS", file.filename),
                fileType: fileType,
                fileSize: file.size,
            });
        }
    }

    const announcement = await Announcement.create({
        ...data,
        attachments,
        createdBy: adminId,
    });

    return announcement.populate("createdBy", "fullName email");
};

/**
 * Update announcement (Admin only)
 */
const updateAnnouncement = async (
    announcementId,
    updates,
    adminId,
    files = null
) => {
    const announcement = await Announcement.findById(announcementId);

    if (!announcement) {
        throw ApiError.notFound("공지사항을 찾을 수 없습니다");
    }

    // Check pin limit if trying to pin (and not already pinned)
    if (
        (updates.isPinned === true || updates.isPinned === "true") &&
        !announcement.isPinned
    ) {
        const pinnedCount = await Announcement.countDocuments({
            isPinned: true,
            _id: { $ne: announcementId },
        });

        if (pinnedCount >= 2) {
            throw ApiError.badRequest(
                "최대 2개까지만 고정할 수 있습니다. 다른 공지사항의 고정을 해제한 후 시도해주세요."
            );
        }

        // Set pinnedOrder for newly pinned announcement
        const maxOrder = await Announcement.findOne({
            isPinned: true,
            _id: { $ne: announcementId },
        })
            .sort({ pinnedOrder: -1 })
            .select("pinnedOrder");

        updates.pinnedOrder = maxOrder ? maxOrder.pinnedOrder + 1 : 0;
    }

    // Handle new file uploads
    if (files && files.length > 0) {
        const newAttachments = [];
        for (const file of files) {
            let fileType = "pdf";
            if (file.mimetype.startsWith("image/")) {
                fileType = "image";
            } else if (
                file.mimetype.includes("excel") ||
                file.mimetype.includes("spreadsheet")
            ) {
                fileType = "excel";
            }

            newAttachments.push({
                fileName: file.originalname,
                fileUrl: getFileUrl("ANNOUNCEMENTS", file.filename),
                fileType: fileType,
                fileSize: file.size,
            });
        }
        // Add new attachments to existing ones
        announcement.attachments.push(...newAttachments);
    }

    // Update other fields
    Object.keys(updates).forEach((key) => {
        if (key !== "attachments") {
            // Don't overwrite attachments array
            announcement[key] = updates[key];
        }
    });

    announcement.updatedBy = adminId;
    await announcement.save();

    return announcement.populate([
        { path: "createdBy", select: "fullName email" },
        { path: "updatedBy", select: "fullName email" },
    ]);
};

/**
 * Delete announcement (Admin only)
 */
const deleteAnnouncement = async (announcementId) => {
    const announcement = await Announcement.findById(announcementId);

    if (!announcement) {
        throw ApiError.notFound("공지사항을 찾을 수 없습니다");
    }

    // Delete all associated files
    if (announcement.attachments && announcement.attachments.length > 0) {
        for (const attachment of announcement.attachments) {
            try {
                deleteFileByUrl(attachment.fileUrl);
            } catch (error) {
                console.error(
                    `Failed to delete file ${attachment.fileUrl}:`,
                    error
                );
                // Continue deleting other files even if one fails
            }
        }
    }

    await announcement.deleteOne();

    return announcement;
};

/**
 * Get announcement statistics (Admin only)
 */
const getStatistics = async () => {
    const totalAnnouncements = await Announcement.countDocuments();
    const activeAnnouncements = await Announcement.countDocuments({
        isActive: true,
    });
    const pinnedAnnouncements = await Announcement.countDocuments({
        isPinned: true,
    });

    // Calculate total views
    const viewsAggregation = await Announcement.aggregate([
        {
            $group: {
                _id: null,
                totalViews: { $sum: "$views" },
            },
        },
    ]);

    const totalViews = viewsAggregation[0]?.totalViews || 0;

    // Get recent announcements (last 5)
    const recentAnnouncements = await Announcement.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title views createdAt")
        .lean();

    // Get most viewed announcements
    const mostViewed = await Announcement.find()
        .sort({ views: -1 })
        .limit(5)
        .select("title views createdAt")
        .lean();

    return {
        totalAnnouncements,
        activeAnnouncements,
        inactiveAnnouncements: totalAnnouncements - activeAnnouncements,
        pinnedAnnouncements,
        totalViews,
        averageViews:
            totalAnnouncements > 0
                ? Math.round(totalViews / totalAnnouncements)
                : 0,
        recentAnnouncements,
        mostViewed,
    };
};

/**
 * Toggle pin status
 */
const togglePin = async (announcementId, adminId) => {
    const announcement = await Announcement.findById(announcementId);

    if (!announcement) {
        throw ApiError.notFound("공지사항을 찾을 수 없습니다");
    }

    // If unpinning, just unpin
    if (announcement.isPinned) {
        announcement.isPinned = false;
        announcement.pinnedOrder = 0;
    } else {
        // If pinning, check pin limit
        const pinnedCount = await Announcement.countDocuments({
            isPinned: true,
        });

        if (pinnedCount >= 2) {
            throw ApiError.badRequest(
                "최대 2개까지만 고정할 수 있습니다. 다른 공지사항의 고정을 해제한 후 시도해주세요."
            );
        }

        // Set pinnedOrder for newly pinned announcement
        const maxOrder = await Announcement.findOne({ isPinned: true })
            .sort({ pinnedOrder: -1 })
            .select("pinnedOrder");

        announcement.isPinned = true;
        announcement.pinnedOrder = maxOrder ? maxOrder.pinnedOrder + 1 : 0;
    }

    announcement.updatedBy = adminId;
    await announcement.save();

    return announcement;
};

/**
 * Toggle active status
 */
const toggleActive = async (announcementId, adminId) => {
    const announcement = await Announcement.findById(announcementId);

    if (!announcement) {
        throw ApiError.notFound("공지사항을 찾을 수 없습니다");
    }

    announcement.isActive = !announcement.isActive;
    announcement.updatedBy = adminId;
    await announcement.save();

    return announcement;
};

/**
 * Reorder pinned announcements
 */
const reorderPinnedAnnouncements = async (announcementsOrder) => {
    // announcementsOrder = [{ id: '...', pinnedOrder: 0 }, { id: '...', pinnedOrder: 1 }]

    const updatePromises = announcementsOrder.map((item) =>
        Announcement.findByIdAndUpdate(
            item.id,
            { pinnedOrder: item.pinnedOrder },
            { new: true, runValidators: true }
        )
    );

    const updatedAnnouncements = await Promise.all(updatePromises);

    // Filter out any null results (announcement not found)
    const validAnnouncements = updatedAnnouncements.filter(
        (announcement) => announcement !== null
    );

    if (validAnnouncements.length !== announcementsOrder.length) {
        throw ApiError.notFound("일부 공지사항을 찾을 수 없습니다");
    }

    return validAnnouncements;
};

/**
 * Get pinned announcements count
 */
const getPinnedCount = async () => {
    const count = await Announcement.countDocuments({ isPinned: true });
    return { count, maxAllowed: 2, canPinMore: count < 2 };
};

/**
 * Delete specific attachment from announcement
 */
const deleteAttachment = async (announcementId, attachmentId, adminId) => {
    const announcement = await Announcement.findById(announcementId);

    if (!announcement) {
        throw ApiError.notFound("공지사항을 찾을 수 없습니다");
    }

    const attachment = announcement.attachments.id(attachmentId);

    if (!attachment) {
        throw ApiError.notFound("첨부파일을 찾을 수 없습니다");
    }

    // Delete the physical file
    try {
        deleteFileByUrl(attachment.fileUrl);
    } catch (error) {
        console.error(`Failed to delete file ${attachment.fileUrl}:`, error);
        // Continue even if file deletion fails
    }

    // Remove from array
    announcement.attachments.pull(attachmentId);
    announcement.updatedBy = adminId;
    await announcement.save();

    return announcement;
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
