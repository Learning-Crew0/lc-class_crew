const Announcement = require("../models/announcement.model");
const ApiError = require("../utils/apiError.util");
const { deleteFile, getFileUrl } = require("../config/fileStorage");

const normalizeData = (data) => {
    const normalized = { ...data };

    if (typeof normalized.tags === "string") {
        normalized.tags = normalized.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean);
    }

    return normalized;
};

const createAnnouncement = async (announcementData, files, adminId) => {
    const normalized = normalizeData(announcementData);

    const announcement = new Announcement({
        ...normalized,
        author: adminId,
        attachments: [],
    });

    if (files && files.length > 0) {
        if (files.length > 5) {
            throw ApiError.badRequest("Maximum 5 attachments allowed");
        }

        announcement.attachments = files.map((file) => ({
            filename: file.originalname,
            url: getFileUrl(file.path),
            size: file.size,
            mimeType: file.mimetype,
            uploadedAt: new Date(),
        }));
    }

    await announcement.save();

    return announcement;
};

const getAllAnnouncements = async (filters = {}) => {
    const { page = 1, limit = 10, category, status, search, isActive } =
        filters;

    const query = {};

    if (category) {
        query.category = category;
    }

    if (status) {
        query.status = status;
    }

    if (isActive !== undefined) {
        query.isActive = isActive === "true" || isActive === true;
    }

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { content: { $regex: search, $options: "i" } },
        ];
    }

    const total = await Announcement.countDocuments(query);
    const announcements = await Announcement.find(query)
        .populate("author", "username fullName")
        .sort({ isPinned: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    return {
        announcements,
        pagination: {
            currentPage: parseInt(page, 10),
            totalPages: Math.ceil(total / limit),
            totalAnnouncements: total,
            limit: parseInt(limit, 10),
        },
    };
};

const getAnnouncementById = async (id, incrementView = false) => {
    const announcement = await Announcement.findById(id).populate(
        "author",
        "username fullName"
    );

    if (!announcement) {
        throw ApiError.notFound("Announcement not found");
    }

    if (incrementView) {
        announcement.views += 1;
        await announcement.save();
    }

    return announcement;
};

const updateAnnouncement = async (id, announcementData, files, adminId) => {
    const announcement = await Announcement.findById(id);

    if (!announcement) {
        throw ApiError.notFound("Announcement not found");
    }

    const normalized = normalizeData(announcementData);

    Object.keys(normalized).forEach((key) => {
        if (normalized[key] !== undefined) {
            announcement[key] = normalized[key];
        }
    });

    announcement.lastModifiedBy = adminId;

    if (files && files.length > 0) {
        const totalAttachments =
            (announcement.attachments?.length || 0) + files.length;
        if (totalAttachments > 5) {
            throw ApiError.badRequest("Maximum 5 attachments allowed");
        }

        const newAttachments = files.map((file) => ({
            filename: file.originalname,
            url: getFileUrl(file.path),
            size: file.size,
            mimeType: file.mimetype,
            uploadedAt: new Date(),
        }));

        announcement.attachments = [
            ...announcement.attachments,
            ...newAttachments,
        ];
    }

    await announcement.save();

    return announcement;
};

const deleteAnnouncement = async (id) => {
    const announcement = await Announcement.findById(id);

    if (!announcement) {
        throw ApiError.notFound("Announcement not found");
    }

    if (announcement.attachments && announcement.attachments.length > 0) {
        for (const attachment of announcement.attachments) {
            try {
                await deleteFile(attachment.url);
            } catch (error) {
                console.error(
                    `Failed to delete file: ${attachment.url}`,
                    error
                );
            }
        }
    }

    await announcement.deleteOne();

    return {
        message: "Announcement deleted successfully",
    };
};

const softDeleteAnnouncement = async (id) => {
    const announcement = await Announcement.findById(id);

    if (!announcement) {
        throw ApiError.notFound("Announcement not found");
    }

    announcement.isActive = false;
    await announcement.save();

    return {
        message: "Announcement archived successfully",
    };
};

const deleteAttachment = async (announcementId, attachmentId) => {
    const announcement = await Announcement.findById(announcementId);

    if (!announcement) {
        throw ApiError.notFound("Announcement not found");
    }

    const attachmentIndex = announcement.attachments.findIndex(
        (att) => att._id.toString() === attachmentId
    );

    if (attachmentIndex === -1) {
        throw ApiError.notFound("Attachment not found");
    }

    const attachment = announcement.attachments[attachmentIndex];

    try {
        await deleteFile(attachment.url);
    } catch (error) {
        console.error(`Failed to delete file: ${attachment.url}`, error);
    }

    announcement.attachments.splice(attachmentIndex, 1);
    await announcement.save();

    return {
        message: "Attachment deleted successfully",
    };
};

const bulkDeleteAnnouncements = async (ids) => {
    const announcements = await Announcement.find({ _id: { $in: ids } });

    for (const announcement of announcements) {
        if (announcement.attachments && announcement.attachments.length > 0) {
            for (const attachment of announcement.attachments) {
                try {
                    await deleteFile(attachment.url);
                } catch (error) {
                    console.error(
                        `Failed to delete file: ${attachment.url}`,
                        error
                    );
                }
            }
        }
    }

    const result = await Announcement.deleteMany({ _id: { $in: ids } });

    return {
        message: `${result.deletedCount} announcements deleted successfully`,
        deletedCount: result.deletedCount,
    };
};

const getAnnouncementStats = async () => {
    const total = await Announcement.countDocuments();
    const published = await Announcement.countDocuments({ status: "published" });
    const draft = await Announcement.countDocuments({ status: "draft" });
    const archived = await Announcement.countDocuments({ status: "archived" });
    const pinned = await Announcement.countDocuments({ isPinned: true });

    const categoryCounts = await Announcement.aggregate([
        {
            $group: {
                _id: "$category",
                count: { $sum: 1 },
            },
        },
    ]);

    const totalViews = await Announcement.aggregate([
        {
            $group: {
                _id: null,
                totalViews: { $sum: "$views" },
            },
        },
    ]);

    return {
        total,
        published,
        draft,
        archived,
        pinned,
        categories: categoryCounts,
        totalViews: totalViews[0]?.totalViews || 0,
    };
};

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

