const Joi = require("joi");

const createCategorySchema = Joi.object({
    title: Joi.string().trim().min(2).max(100).required().messages({
        "string.empty": "카테고리 제목을 입력해주세요",
        "string.min": "카테고리 제목은 최소 2자 이상이어야 합니다",
        "any.required": "카테고리 제목은 필수입니다",
    }),
    description: Joi.string().trim().max(500).optional(),
    parentCategory: Joi.string().hex().length(24).optional(),
    level: Joi.number().integer().min(1).max(3).default(1),
    order: Joi.number().integer().min(0).default(0),
    isActive: Joi.boolean().default(true),
});

const updateCategorySchema = Joi.object({
    title: Joi.string().trim().min(2).max(100).optional(),
    description: Joi.string().trim().max(500).optional(),
    parentCategory: Joi.string().hex().length(24).allow(null).optional(),
    level: Joi.number().integer().min(1).max(3).optional(),
    order: Joi.number().integer().min(0).optional(),
    isActive: Joi.boolean().optional(),
});

module.exports = {
    createCategorySchema,
    updateCategorySchema,
};

