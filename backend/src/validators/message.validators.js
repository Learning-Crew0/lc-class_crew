const Joi = require("joi");

const createMessageSchema = Joi.object({
    title: Joi.string().trim().max(200).optional().messages({
        "string.max": "제목은 200자를 초과할 수 없습니다",
    }),
    message: Joi.string().trim().max(2000).required().messages({
        "string.max": "메시지는 2000자를 초과할 수 없습니다",
        "any.required": "메시지 내용을 입력해주세요",
    }),
    courseName: Joi.string().trim().max(200).optional().messages({
        "string.max": "과정명은 200자를 초과할 수 없습니다",
    }),
    type: Joi.string().valid("auto", "manual", "system").optional().messages({
        "any.only": "메시지 타입은 auto, manual, system 중 하나여야 합니다",
    }),
    triggerEvent: Joi.string().trim().max(100).optional().messages({
        "string.max": "트리거 이벤트는 100자를 초과할 수 없습니다",
    }),
    recipientType: Joi.string()
        .valid("single", "multiple", "all")
        .required()
        .messages({
            "any.only": "수신자 타입은 single, multiple, all 중 하나여야 합니다",
            "any.required": "수신자 타입을 선택해주세요",
        }),
    recipientUserIds: Joi.array()
        .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
        .when("recipientType", {
            is: Joi.string().valid("single", "multiple"),
            then: Joi.array().required().min(1),
            otherwise: Joi.optional(),
        })
        .messages({
            "array.min": "최소 1명의 수신자를 선택해주세요",
            "string.pattern.base": "올바른 사용자 ID 형식이 아닙니다",
        }),
});

const updateMessageSchema = Joi.object({
    title: Joi.string().trim().max(200).optional(),
    message: Joi.string().trim().max(2000).optional(),
    courseName: Joi.string().trim().max(200).optional(),
    type: Joi.string().valid("auto", "manual", "system").optional(),
    triggerEvent: Joi.string().trim().max(100).optional(),
    isActive: Joi.boolean().optional(),
});

const getMessagesQuerySchema = Joi.object({
    period: Joi.string().valid("1month", "3months", "6months").optional(),
    status: Joi.string().valid("read", "unread").optional(),
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
});

module.exports = {
    createMessageSchema,
    updateMessageSchema,
    getMessagesQuerySchema,
};

