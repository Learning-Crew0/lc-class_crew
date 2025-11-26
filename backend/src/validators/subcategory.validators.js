const Joi = require("joi");

const createSubcategorySchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required().messages({
        "string.empty": "서브카테고리 이름을 입력해주세요",
        "any.required": "서브카테고리 이름은 필수입니다",
    }),
    categoryId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            "string.pattern.base": "유효한 카테고리 ID를 입력해주세요",
            "any.required": "카테고리 ID는 필수입니다",
        }),
    order: Joi.number().integer().min(0).optional(),
});

const updateSubcategorySchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).optional(),
    order: Joi.number().integer().min(0).optional(),
    isActive: Joi.boolean().optional(),
});

module.exports = {
    createSubcategorySchema,
    updateSubcategorySchema,
};
