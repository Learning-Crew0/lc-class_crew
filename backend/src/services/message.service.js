const Message = require("../models/message.model");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError.util");

/**
 * Get messages for a user with filters
 */
const getUserMessages = async (userId, query) => {
    const { period, status, page = 1, limit = 20 } = query;

    // Build filter
    const filter = {
        recipientUserIds: userId,
        isActive: true,
    };

    // Period filter
    if (period) {
        const now = new Date();
        let startDate;

        switch (period) {
            case "1month":
                startDate = new Date(now.setMonth(now.getMonth() - 1));
                break;
            case "3months":
                startDate = new Date(now.setMonth(now.getMonth() - 3));
                break;
            case "6months":
                startDate = new Date(now.setMonth(now.getMonth() - 6));
                break;
        }

        if (startDate) {
            filter.createdAt = { $gte: startDate };
        }
    }

    // Get total count
    const total = await Message.countDocuments(filter);

    // Fetch messages
    let messages = await Message.find(filter)
        .select("title message courseName type triggerEvent readBy createdAt")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

    // Format messages for frontend
    messages = messages.map((msg) => {
        const isRead = msg.readBy.some(
            (read) => read.userId.toString() === userId.toString()
        );

        return {
            _id: msg._id,
            title: msg.title || "",
            message: msg.message,
            courseName: msg.courseName || "",
            isRead,
            createdAt: msg.createdAt,
            type: msg.type,
            triggerEvent: msg.triggerEvent || "",
        };
    });

    // Status filter (applied after fetching because isRead is computed)
    if (status === "read") {
        messages = messages.filter((msg) => msg.isRead);
    } else if (status === "unread") {
        messages = messages.filter((msg) => !msg.isRead);
    }

    return {
        messages,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page * limit < total,
            hasPrevPage: page > 1,
        },
    };
};

/**
 * Get unread message count for a user
 */
const getUnreadCount = async (userId) => {
    const messages = await Message.find({
        recipientUserIds: userId,
        isActive: true,
    })
        .select("readBy")
        .lean();

    const unreadCount = messages.filter((msg) => {
        return !msg.readBy.some(
            (read) => read.userId.toString() === userId.toString()
        );
    }).length;

    return { unreadCount };
};

/**
 * Mark a single message as read
 */
const markMessageAsRead = async (messageId, userId) => {
    const message = await Message.findOne({
        _id: messageId,
        recipientUserIds: userId,
        isActive: true,
    });

    if (!message) {
        throw ApiError.notFound("메시지를 찾을 수 없습니다");
    }

    // Check if already read
    if (message.isReadByUser(userId)) {
        return { message: "이미 읽은 메시지입니다" };
    }

    // Mark as read
    await message.markAsReadByUser(userId);

    return { message: "메시지를 읽음으로 표시했습니다" };
};

/**
 * Mark all messages as read for a user
 */
const markAllMessagesAsRead = async (userId) => {
    const messages = await Message.find({
        recipientUserIds: userId,
        isActive: true,
    });

    let markedCount = 0;

    for (const message of messages) {
        if (!message.isReadByUser(userId)) {
            await message.markAsReadByUser(userId);
            markedCount++;
        }
    }

    return {
        message: `${markedCount}개의 메시지를 읽음으로 표시했습니다`,
        markedCount,
    };
};

/**
 * Create and send a message (Admin)
 */
const createMessage = async (messageData, adminId) => {
    const { recipientType, recipientUserIds, ...rest } = messageData;

    // If recipientType is "all", get all active user IDs
    let finalRecipientIds = recipientUserIds || [];

    if (recipientType === "all") {
        const allUsers = await User.find({ isActive: true }).select("_id");
        finalRecipientIds = allUsers.map((user) => user._id);
    }

    // Validate recipient IDs exist
    if (finalRecipientIds.length > 0) {
        const existingUsers = await User.find({
            _id: { $in: finalRecipientIds },
        }).select("_id");

        const existingUserIds = existingUsers.map((u) => u._id.toString());
        const invalidIds = finalRecipientIds.filter(
            (id) => !existingUserIds.includes(id.toString())
        );

        if (invalidIds.length > 0) {
            throw ApiError.badRequest(
                `존재하지 않는 사용자 ID: ${invalidIds.join(", ")}`
            );
        }
    }

    if (finalRecipientIds.length === 0) {
        throw ApiError.badRequest("수신자가 없습니다");
    }

    // Create message
    const message = await Message.create({
        ...rest,
        recipientType,
        recipientUserIds: finalRecipientIds,
        createdBy: adminId,
        readBy: [],
    });

    return message;
};

/**
 * Get all messages (Admin)
 */
const getAllMessages = async (query) => {
    const { page = 1, limit = 20, type, recipientType } = query;

    const filter = {};

    if (type) {
        filter.type = type;
    }

    if (recipientType) {
        filter.recipientType = recipientType;
    }

    const total = await Message.countDocuments(filter);

    const messages = await Message.find(filter)
        .populate("createdBy", "username email")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    return {
        messages,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page * limit < total,
            hasPrevPage: page > 1,
        },
    };
};

/**
 * Get message by ID (Admin)
 */
const getMessageById = async (messageId) => {
    const message = await Message.findById(messageId)
        .populate("createdBy", "username email")
        .populate("recipientUserIds", "username email fullName");

    if (!message) {
        throw ApiError.notFound("메시지를 찾을 수 없습니다");
    }

    return message;
};

/**
 * Update message (Admin)
 */
const updateMessage = async (messageId, updates) => {
    const message = await Message.findByIdAndUpdate(messageId, updates, {
        new: true,
        runValidators: true,
    });

    if (!message) {
        throw ApiError.notFound("메시지를 찾을 수 없습니다");
    }

    return message;
};

/**
 * Delete message (Admin)
 */
const deleteMessage = async (messageId) => {
    const message = await Message.findByIdAndUpdate(
        messageId,
        { isActive: false },
        { new: true }
    );

    if (!message) {
        throw ApiError.notFound("메시지를 찾을 수 없습니다");
    }

    return { message: "메시지가 삭제되었습니다" };
};

/**
 * Get message statistics (Admin)
 */
const getMessageStatistics = async () => {
    const totalMessages = await Message.countDocuments({ isActive: true });
    const autoMessages = await Message.countDocuments({
        type: "auto",
        isActive: true,
    });
    const manualMessages = await Message.countDocuments({
        type: "manual",
        isActive: true,
    });
    const systemMessages = await Message.countDocuments({
        type: "system",
        isActive: true,
    });

    // Get average read rate
    const messages = await Message.find({ isActive: true }).select(
        "recipientUserIds readBy"
    );

    let totalReadRate = 0;
    messages.forEach((msg) => {
        if (msg.recipientUserIds.length > 0) {
            const rate = (msg.readBy.length / msg.recipientUserIds.length) * 100;
            totalReadRate += rate;
        }
    });

    const averageReadRate =
        messages.length > 0 ? (totalReadRate / messages.length).toFixed(2) : 0;

    return {
        totalMessages,
        messagesByType: {
            auto: autoMessages,
            manual: manualMessages,
            system: systemMessages,
        },
        averageReadRate: parseFloat(averageReadRate),
    };
};

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

