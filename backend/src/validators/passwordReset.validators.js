const Joi = require("joi");

const initiatePasswordResetSchema = Joi.object({
    name: Joi.string().trim().min(2).required().messages({
        "string.min": "이름은 2자 이상이어야 합니다",
        "any.required": "이름을 입력해주세요",
    }),
    phoneNumber: Joi.string()
        .trim()
        .pattern(/^01[0-9]{9}$|^01[0-9]-[0-9]{4}-[0-9]{4}$/)
        .required()
        .messages({
            "string.pattern.base":
                "올바른 전화번호 형식이 아닙니다 (예: 01012345678 또는 010-1234-5678)",
            "any.required": "전화번호를 입력해주세요",
        }),
});

const verifyCodeSchema = Joi.object({
    sessionId: Joi.string().required().messages({
        "any.required": "세션 ID가 필요합니다",
    }),
    verificationCode: Joi.string()
        .length(6)
        .pattern(/^[0-9]{6}$/)
        .required()
        .messages({
            "string.length": "인증번호는 6자리여야 합니다",
            "string.pattern.base": "올바른 인증번호를 입력해주세요",
            "any.required": "인증번호를 입력해주세요",
        }),
});

const resetPasswordSchema = Joi.object({
    resetToken: Joi.string().required().messages({
        "any.required": "리셋 토큰이 필요합니다",
    }),
    newPassword: Joi.string().min(8).max(128).required().messages({
        "string.min": "비밀번호는 8자 이상이어야 합니다",
        "string.max": "비밀번호는 128자를 초과할 수 없습니다",
        "any.required": "새 비밀번호를 입력해주세요",
    }),
});

const findIdSchema = Joi.object({
    name: Joi.string().trim().min(2).required().messages({
        "string.min": "이름은 2자 이상이어야 합니다",
        "any.required": "이름을 입력해주세요",
    }),
    phoneNumber: Joi.string()
        .trim()
        .pattern(/^01[0-9]{9}$|^01[0-9]-[0-9]{4}-[0-9]{4}$/)
        .required()
        .messages({
            "string.pattern.base":
                "올바른 전화번호 형식이 아닙니다 (예: 01012345678 또는 010-1234-5678)",
            "any.required": "전화번호를 입력해주세요",
        }),
});

module.exports = {
    initiatePasswordResetSchema,
    verifyCodeSchema,
    resetPasswordSchema,
    findIdSchema,
};
