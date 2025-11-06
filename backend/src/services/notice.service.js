const Notice = require("../models/notice.model");
const {
  getPaginationParams,
  createPaginationMeta,
} = require("../utils/pagination.util");

/**
 * Get all notices with filters
 */
const getAllNotices = async (query) => {
  const { page, limit, skip } = getPaginationParams(query);

  const filter = {};

  // For public access, only show published and non-expired notices
  if (query.publicOnly) {
    filter.isPublished = true;
    filter.$or = [
      { expiresAt: { $exists: false } },
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } },
    ];
  }

  if (query.type) {
    filter.type = query.type;
  }

  if (query.targetAudience) {
    filter.targetAudience = query.targetAudience;
  }

  const sortOptions = query.publicOnly
    ? { isPinned: -1, publishedAt: -1 }
    : { createdAt: -1 };

  const notices = await Notice.find(filter)
    .populate("createdBy", "name email")
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);

  const total = await Notice.countDocuments(filter);

  return {
    notices,
    pagination: createPaginationMeta(page, limit, total),
  };
};

/**
 * Get notice by ID
 */
const getNoticeById = async (noticeId) => {
  const notice = await Notice.findById(noticeId)
    .populate("createdBy", "name email")
    .populate("targetUsers", "firstName lastName email");

  if (!notice) {
    throw new Error("Notice not found");
  }

  // Increment views
  notice.views += 1;
  await notice.save();

  return notice;
};

/**
 * Create notice
 */
const createNotice = async (noticeData, adminId) => {
  const notice = await Notice.create({
    ...noticeData,
    createdBy: adminId,
  });

  return notice;
};

/**
 * Update notice
 */
const updateNotice = async (noticeId, updates) => {
  const notice = await Notice.findByIdAndUpdate(noticeId, updates, {
    new: true,
    runValidators: true,
  });

  if (!notice) {
    throw new Error("Notice not found");
  }

  return notice;
};

/**
 * Delete notice
 */
const deleteNotice = async (noticeId) => {
  const notice = await Notice.findByIdAndDelete(noticeId);

  if (!notice) {
    throw new Error("Notice not found");
  }

  return { message: "Notice deleted successfully" };
};

/**
 * Publish/unpublish notice
 */
const togglePublishStatus = async (noticeId) => {
  const notice = await Notice.findById(noticeId);

  if (!notice) {
    throw new Error("Notice not found");
  }

  notice.isPublished = !notice.isPublished;

  if (notice.isPublished && !notice.publishedAt) {
    notice.publishedAt = Date.now();
  }

  await notice.save();

  return notice;
};

/**
 * Pin/unpin notice
 */
const togglePinStatus = async (noticeId) => {
  const notice = await Notice.findById(noticeId);

  if (!notice) {
    throw new Error("Notice not found");
  }

  notice.isPinned = !notice.isPinned;
  await notice.save();

  return notice;
};

module.exports = {
  getAllNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
  togglePublishStatus,
  togglePinStatus,
};
