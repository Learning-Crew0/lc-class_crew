const noticeService = require("../services/notice.service");
const {
  successResponse,
  paginatedResponse,
} = require("../utils/response.util");

/**
 * Get all notices
 */
const getAllNotices = async (req, res, next) => {
  try {
    const { notices, pagination } = await noticeService.getAllNotices(
      req.query
    );
    return paginatedResponse(
      res,
      notices,
      pagination,
      "Notices retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get notice by ID
 */
const getNoticeById = async (req, res, next) => {
  try {
    const notice = await noticeService.getNoticeById(req.params.id);
    return successResponse(res, notice, "Notice retrieved successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Create notice
 */
const createNotice = async (req, res, next) => {
  try {
    const notice = await noticeService.createNotice(req.body, req.user.id);
    return successResponse(res, notice, "Notice created successfully", 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Update notice
 */
const updateNotice = async (req, res, next) => {
  try {
    const notice = await noticeService.updateNotice(req.params.id, req.body);
    return successResponse(res, notice, "Notice updated successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Delete notice
 */
const deleteNotice = async (req, res, next) => {
  try {
    const result = await noticeService.deleteNotice(req.params.id);
    return successResponse(res, result, "Notice deleted successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle publish status
 */
const togglePublish = async (req, res, next) => {
  try {
    const notice = await noticeService.togglePublishStatus(req.params.id);
    return successResponse(res, notice, "Notice status updated successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle pin status
 */
const togglePin = async (req, res, next) => {
  try {
    const notice = await noticeService.togglePinStatus(req.params.id);
    return successResponse(
      res,
      notice,
      "Notice pin status updated successfully"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
  togglePublish,
  togglePin,
};
