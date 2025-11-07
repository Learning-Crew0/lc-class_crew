const Joi = require("joi");

const moduleSchema = Joi.object({
    name: Joi.string().trim().min(2).max(200).required().messages({
        "string.empty": "모듈 이름을 입력해주세요",
        "any.required": "모듈 이름은 필수입니다",
    }),
    content: Joi.string().trim().required().messages({
        "string.empty": "모듈 내용을 입력해주세요",
        "any.required": "모듈 내용은 필수입니다",
    }),
    order: Joi.number().integer().min(0).default(0),
});

const createCurriculumSchema = Joi.object({
    keywords: Joi.array().items(Joi.string().trim()).optional(),
    modules: Joi.array().items(moduleSchema).min(1).required().messages({
        "array.min": "최소 1개의 모듈이 필요합니다",
        "any.required": "모듈은 필수입니다",
    }),
});

const updateCurriculumSchema = Joi.object({
    keywords: Joi.array().items(Joi.string().trim()).optional(),
    modules: Joi.array().items(moduleSchema).min(1).optional(),
});

module.exports = {
    createCurriculumSchema,
    updateCurriculumSchema,
};

