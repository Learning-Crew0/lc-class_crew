const Joi = require("joi");

const createEnrollmentSchema = Joi.object({
    paymentMethod: Joi.string().valid("card", "bank_transfer", "cash", "other").optional(),
    amountPaid: Joi.number().min(0).required().messages({
        "number.min": "결제 금액은 0 이상이어야 합니다",
        "any.required": "결제 금액은 필수입니다",
    }),
});

const updateEnrollmentStatusSchema = Joi.object({
    status: Joi.string().valid("수강예정", "수강중", "수료", "미수료", "취소").required().messages({
        "any.required": "상태는 필수입니다",
    }),
});

const updateEnrollmentProgressSchema = Joi.object({
    progress: Joi.number().min(0).max(100).required().messages({
        "number.min": "진도율은 0-100 사이여야 합니다",
        "number.max": "진도율은 0-100 사이여야 합니다",
        "any.required": "진도율은 필수입니다",
    }),
});

const requestRefundSchema = Joi.object({
    refundReason: Joi.string().trim().min(10).max(500).required().messages({
        "string.empty": "환불 사유를 입력해주세요",
        "string.min": "환불 사유는 최소 10자 이상 작성해주세요",
        "any.required": "환불 사유는 필수입니다",
    }),
    refundAmount: Joi.number().min(0).required().messages({
        "number.min": "환불 금액은 0 이상이어야 합니다",
        "any.required": "환불 금액은 필수입니다",
    }),
});

const processRefundSchema = Joi.object({
    refundStatus: Joi.string().valid("approved", "rejected", "completed").required().messages({
        "any.required": "환불 상태는 필수입니다",
    }),
});

module.exports = {
    createEnrollmentSchema,
    updateEnrollmentStatusSchema,
    updateEnrollmentProgressSchema,
    requestRefundSchema,
    processRefundSchema,
};
