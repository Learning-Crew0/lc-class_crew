const Joi = require("joi");

/**
 * Validation schemas for Announcement endpoints
 */

// Create announcement validation
const createAnnouncementSchema = Joi.object({
    title: Joi.string().trim().min(1).max(200).required().messages({
        "string.empty": "제목을 입력해주세요",
        "string.min": "제목은 최소 1자 이상이어야 합니다",
        "string.max": "제목은 200자 이내로 입력해주세요",
        "any.required": "제목을 입력해주세요",
    }),
    content: Joi.string().trim().min(10).required().messages({
        "string.empty": "내용을 입력해주세요",
        "string.min": "내용은 최소 10자 이상 입력해주세요",
        "any.required": "내용을 입력해주세요",
    }),
    isPinned: Joi.boolean().optional().messages({
        "boolean.base": "isPinned는 boolean 타입이어야 합니다",
    }),
    isActive: Joi.boolean().optional().messages({
        "boolean.base": "isActive는 boolean 타입이어야 합니다",
    }),
});

// Update announcement validation
const updateAnnouncementSchema = Joi.object({
    title: Joi.string().trim().min(1).max(200).optional().messages({
        "string.empty": "제목을 입력해주세요",
        "string.min": "제목은 최소 1자 이상이어야 합니다",
        "string.max": "제목은 200자 이내로 입력해주세요",
    }),
    content: Joi.string().trim().min(10).optional().messages({
        "string.empty": "내용을 입력해주세요",
        "string.min": "내용은 최소 10자 이상 입력해주세요",
    }),
    isPinned: Joi.boolean().optional().messages({
        "boolean.base": "isPinned는 boolean 타입이어야 합니다",
    }),
    isActive: Joi.boolean().optional().messages({
        "boolean.base": "isActive는 boolean 타입이어야 합니다",
    }),
}).min(1).messages({
    "object.min": "최소 하나 이상의 필드를 수정해야 합니다",
});

// Query parameters validation for getting announcements
const getAnnouncementsQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).optional().default(1).messages({
        "number.base": "페이지 번호는 숫자여야 합니다",
        "number.min": "페이지 번호는 1 이상이어야 합니다",
    }),
    limit: Joi.number().integer().min(1).max(50).optional().default(10).messages({
        "number.base": "페이지 크기는 숫자여야 합니다",
        "number.min": "페이지 크기는 최소 1 이상이어야 합니다",
        "number.max": "페이지 크기는 최대 50까지 가능합니다",
    }),
    isActive: Joi.boolean().optional().messages({
        "boolean.base": "isActive는 boolean 타입이어야 합니다",
    }),
    sort: Joi.string()
        .valid("createdAt", "-createdAt", "title", "-title", "views", "-views")
        .optional()
        .default("-createdAt")
        .messages({
            "any.only": "정렬 필드는 createdAt, title, views 중 하나여야 합니다",
        }),
    search: Joi.string().trim().max(100).optional().messages({
        "string.max": "검색어는 100자 이내로 입력해주세요",
    }),
});

module.exports = {
    createAnnouncementSchema,
    updateAnnouncementSchema,
    getAnnouncementsQuerySchema,
};
