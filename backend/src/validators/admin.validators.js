const Joi = require("joi");

const createAdminSchema = Joi.object({
    email: Joi.string().email().max(254).required().messages({
        "string.email": "올바른 이메일 형식을 입력해주세요",
        "any.required": "이메일을 입력해주세요",
    }),
    username: Joi.string().trim().min(3).max(50).required().messages({
        "string.min": "사용자명은 3자 이상이어야 합니다",
        "any.required": "사용자명을 입력해주세요",
    }),
    password: Joi.string().min(8).max(128).required().messages({
        "string.min": "비밀번호는 8자 이상이어야 합니다",
        "any.required": "비밀번호를 입력해주세요",
    }),
    fullName: Joi.string().trim().min(2).max(100).required().messages({
        "string.min": "이름은 2자 이상이어야 합니다",
        "any.required": "이름을 입력해주세요",
    }),
    role: Joi.string().valid("admin", "superadmin").optional().default("admin"),
});

const updateAdminSchema = Joi.object({
    email: Joi.string().email().max(254).optional(),
    fullName: Joi.string().trim().min(2).max(100).optional(),
});

const updateAdminStatusSchema = Joi.object({
    isActive: Joi.boolean().required().messages({
        "any.required": "상태 값을 입력해주세요",
    }),
});

const updateAdminPasswordSchema = Joi.object({
    currentPassword: Joi.string().required().messages({
        "any.required": "현재 비밀번호를 입력해주세요",
    }),
    newPassword: Joi.string().min(8).max(128).required().messages({
        "string.min": "새 비밀번호는 8자 이상이어야 합니다",
        "any.required": "새 비밀번호를 입력해주세요",
    }),
});

module.exports = {
    createAdminSchema,
    updateAdminSchema,
    updateAdminStatusSchema,
    updateAdminPasswordSchema,
};
