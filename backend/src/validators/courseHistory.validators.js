const Joi = require("joi");

// Verify user identity and get course history
const verifyCourseHistorySchema = Joi.object({
    phone: Joi.string()
        .pattern(/^01[0-9]{9,10}$|^[6-9][0-9]{9}$|^91[6-9][0-9]{9}$|^82[0-9]{9,10}$|^\+?[0-9]{10,15}$/)
        .required()
        .messages({
            "string.pattern.base": "올바른 휴대전화번호 형식이 아닙니다.",
            "any.required": "휴대전화번호는 필수입니다.",
        }),
    email: Joi.string().email().required().messages({
        "string.email": "올바른 이메일 형식이 아닙니다.",
        "any.required": "이메일은 필수입니다.",
    }),
    name: Joi.string().min(2).max(50).required().messages({
        "string.min": "이름은 최소 2자 이상이어야 합니다.",
        "string.max": "이름은 최대 50자까지 입력 가능합니다.",
        "any.required": "이름은 필수입니다.",
    }),
    type: Joi.string().valid("personal", "company").required().messages({
        "any.only": "타입은 'personal' 또는 'company'이어야 합니다.",
        "any.required": "타입은 필수입니다.",
    }),
});

module.exports = {
    verifyCourseHistorySchema,
};
