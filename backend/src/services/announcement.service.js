const Announcement = require("../models/announcement.model");
const ApiError = require("../utils/apiError.util");
const {
    getPaginationParams,
    createPaginationMeta,
} = require("../utils/pagination.util");

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

    // Custom sort for pinned items first
    const sortOptions = {};
    if (sortField === "-createdAt" || sortField === "createdAt") {
        sortOptions.isPinned = -1; // Pinned first
        sortOptions.createdAt = sortField === "-createdAt" ? -1 : 1;
    } else if (sortField === "-views" || sortField === "views") {
        sortOptions.isPinned = -1;
        sortOptions.views = sortField === "-views" ? -1 : 1;
        sortOptions.createdAt = -1; // Secondary sort
    } else if (sortField === "-title" || sortField === "title") {
        sortOptions.isPinned = -1;
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
const createAnnouncement = async (data, adminId) => {
    const announcement = await Announcement.create({
        ...data,
        createdBy: adminId,
    });

    return announcement.populate("createdBy", "fullName email");
};

/**
 * Update announcement (Admin only)
 */
const updateAnnouncement = async (announcementId, updates, adminId) => {
    const announcement = await Announcement.findById(announcementId);

    if (!announcement) {
        throw ApiError.notFound("공지사항을 찾을 수 없습니다");
    }

    // Update fields
    Object.keys(updates).forEach((key) => {
        announcement[key] = updates[key];
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
    const announcement = await Announcement.findByIdAndDelete(announcementId);

    if (!announcement) {
        throw ApiError.notFound("공지사항을 찾을 수 없습니다");
    }

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

    announcement.isPinned = !announcement.isPinned;
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

module.exports = {
    getAllAnnouncements,
    getAnnouncementById,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    getStatistics,
    togglePin,
    toggleActive,
};
