const messageService = require("../services/message.service");
const { successResponse } = require("../utils/response.util");
const asyncHandler = require("../utils/asyncHandler.util");

/**
 * Get user messages with filters
 * GET /api/v1/user/messages
 */
const getUserMessages = asyncHandler(async (req, res) => {
    const result = await messageService.getUserMessages(req.user.id, req.query);
    return successResponse(
        res,
        result,
        "메시지를 성공적으로 조회했습니다"
    );
});

/**
 * Get unread message count
 * GET /api/v1/user/messages/unread-count
 */
const getUnreadCount = asyncHandler(async (req, res) => {
    const result = await messageService.getUnreadCount(req.user.id);
    return successResponse(res, result, "읽지 않은 메시지 수를 조회했습니다");
});

/**
 * Mark message as read
 * PUT /api/v1/user/messages/:id/read
 */
const markMessageAsRead = asyncHandler(async (req, res) => {
    const result = await messageService.markMessageAsRead(
        req.params.id,
        req.user.id
    );
    return successResponse(res, result, result.message);
});

/**
 * Mark all messages as read
 * PUT /api/v1/user/messages/read-all
 */
const markAllMessagesAsRead = asyncHandler(async (req, res) => {
    const result = await messageService.markAllMessagesAsRead(req.user.id);
    return successResponse(res, result, result.message);
});

/**
 * Create message (Admin)
 * POST /api/v1/admin/messages
 */
const createMessage = asyncHandler(async (req, res) => {
    const message = await messageService.createMessage(req.body, req.user.id);
    return successResponse(res, message, "메시지를 성공적으로 전송했습니다", 201);
});

/**
 * Get all messages (Admin)
 * GET /api/v1/admin/messages
 */
const getAllMessages = asyncHandler(async (req, res) => {
    const result = await messageService.getAllMessages(req.query);
    return successResponse(
        res,
        result,
        "메시지 목록을 성공적으로 조회했습니다"
    );
});

/**
 * Get message by ID (Admin)
 * GET /api/v1/admin/messages/:id
 */
const getMessageById = asyncHandler(async (req, res) => {
    const message = await messageService.getMessageById(req.params.id);
    return successResponse(res, message, "메시지를 성공적으로 조회했습니다");
});

/**
 * Update message (Admin)
 * PUT /api/v1/admin/messages/:id
 */
const updateMessage = asyncHandler(async (req, res) => {
    const message = await messageService.updateMessage(
        req.params.id,
        req.body
    );
    return successResponse(res, message, "메시지를 성공적으로 수정했습니다");
});

/**
 * Delete message (Admin)
 * DELETE /api/v1/admin/messages/:id
 */
const deleteMessage = asyncHandler(async (req, res) => {
    const result = await messageService.deleteMessage(req.params.id);
    return successResponse(res, result, result.message);
});

/**
 * Get message statistics (Admin)
 * GET /api/v1/admin/messages/statistics
 */
const getMessageStatistics = asyncHandler(async (req, res) => {
    const stats = await messageService.getMessageStatistics();
    return successResponse(
        res,
        stats,
        "메시지 통계를 성공적으로 조회했습니다"
    );
});

module.exports = {
    getUserMessages,
    getUnreadCount,
    markMessageAsRead,
    markAllMessagesAsRead,
    createMessage,
    getAllMessages,
    getMessageById,
    updateMessage,
    deleteMessage,
    getMessageStatistics,
};

