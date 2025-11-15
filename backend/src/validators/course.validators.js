const Joi = require("joi");
const { CATEGORY_SLUGS, POSITION_SLUGS } = require("../constants/categories");

const createCourseSchema = Joi.object({
    title: Joi.string().trim().min(3).max(200).required().messages({
        "string.empty": "코스 제목을 입력해주세요",
        "string.min": "코스 제목은 최소 3자 이상이어야 합니다",
        "any.required": "코스 제목은 필수입니다",
    }),
    shortDescription: Joi.string().trim().max(500).optional(),
    longDescription: Joi.string().trim().optional(),
    description: Joi.string().trim().optional(),
    // Category slug (required) - must be one of 5 categories
    category: Joi.string()
        .trim()
        .valid(...CATEGORY_SLUGS)
        .required()
        .messages({
            "string.empty": "카테고리를 선택해주세요",
            "any.required": "카테고리는 필수입니다",
            "any.only": "유효한 카테고리를 선택해주세요",
        }),
    // Position slug (required) - must be one of 9 positions
    position: Joi.string()
        .trim()
        .valid(...POSITION_SLUGS)
        .required()
        .messages({
            "string.empty": "직급/직책을 선택해주세요",
            "any.required": "직급/직책은 필수입니다",
            "any.only": "유효한 직급/직책을 선택해주세요",
        }),
    tagText: Joi.string().trim().max(50).optional(),
    tagColor: Joi.string().trim().default("text-blue-500"),
    tags: Joi.alternatives()
        .try(Joi.array().items(Joi.string().trim()), Joi.string().trim())
        .optional(),
    price: Joi.alternatives()
        .try(
            Joi.number().min(0),
            Joi.string()
                .trim()
                .pattern(/^\d+$/)
                .custom((value) => parseInt(value, 10))
        )
        .required()
        .messages({
            "number.base": "가격은 숫자여야 합니다",
            "number.min": "가격은 0 이상이어야 합니다",
            "any.required": "가격은 필수입니다",
        }),
    priceText: Joi.string().trim().optional(),
    date: Joi.string().trim().optional(),
    duration: Joi.string().trim().optional(),
    location: Joi.string().trim().optional(),
    hours: Joi.alternatives()
        .try(
            Joi.number().min(0),
            Joi.string()
                .trim()
                .pattern(/^\d+$/)
                .custom((value) => parseInt(value, 10))
        )
        .optional(),
    target: Joi.string().trim().optional(),
    recommendedAudience: Joi.alternatives()
        .try(Joi.array().items(Joi.string().trim()), Joi.string().trim())
        .optional(),
    targetAudience: Joi.alternatives()
        .try(Joi.array().items(Joi.string().trim()), Joi.string().trim())
        .optional(),
    learningGoals: Joi.alternatives()
        .try(Joi.string().trim(), Joi.array().items(Joi.string().trim()))
        .optional(),
    whatYouWillLearn: Joi.alternatives()
        .try(Joi.array().items(Joi.string().trim()), Joi.string().trim())
        .optional(),
    requirements: Joi.alternatives()
        .try(Joi.array().items(Joi.string().trim()), Joi.string().trim())
        .optional(),
    field: Joi.string().trim().optional(),
    processName: Joi.string().trim().optional(),
    refundOptions: Joi.string().trim().optional(),
    level: Joi.string()
        .valid("beginner", "intermediate", "advanced", "all")
        .default("all"),
    language: Joi.string().trim().default("none"),
    isActive: Joi.alternatives()
        .try(
            Joi.boolean(),
            Joi.string()
                .valid("true", "false", "1", "0")
                .custom((value) => value === "true" || value === "1")
        )
        .default(true),
    isFeatured: Joi.alternatives()
        .try(
            Joi.boolean(),
            Joi.string()
                .valid("true", "false", "1", "0")
                .custom((value) => value === "true" || value === "1")
        )
        .default(false),
});

const updateCourseSchema = Joi.object({
    title: Joi.string().trim().min(3).max(200).optional(),
    shortDescription: Joi.string().trim().max(500).optional(),
    longDescription: Joi.string().trim().optional(),
    description: Joi.string().trim().optional(),
    // Category slug (optional for updates)
    category: Joi.string()
        .trim()
        .valid(...CATEGORY_SLUGS)
        .optional()
        .messages({
            "any.only": "유효한 카테고리를 선택해주세요",
        }),
    // Position slug (optional for updates)
    position: Joi.string()
        .trim()
        .valid(...POSITION_SLUGS)
        .optional()
        .messages({
            "any.only": "유효한 직급/직책을 선택해주세요",
        }),
    tagText: Joi.string().trim().max(50).optional(),
    tagColor: Joi.string().trim().optional(),
    tags: Joi.alternatives()
        .try(Joi.array().items(Joi.string().trim()), Joi.string().trim())
        .optional(),
    price: Joi.alternatives()
        .try(
            Joi.number().min(0),
            Joi.string()
                .trim()
                .pattern(/^\d+$/)
                .custom((value) => parseInt(value, 10))
        )
        .optional(),
    priceText: Joi.string().trim().optional(),
    date: Joi.string().trim().optional(),
    duration: Joi.string().trim().optional(),
    location: Joi.string().trim().optional(),
    hours: Joi.alternatives()
        .try(
            Joi.number().min(0),
            Joi.string()
                .trim()
                .pattern(/^\d+$/)
                .custom((value) => parseInt(value, 10))
        )
        .optional(),
    target: Joi.string().trim().optional(),
    recommendedAudience: Joi.alternatives()
        .try(Joi.array().items(Joi.string().trim()), Joi.string().trim())
        .optional(),
    targetAudience: Joi.alternatives()
        .try(Joi.array().items(Joi.string().trim()), Joi.string().trim())
        .optional(),
    learningGoals: Joi.alternatives()
        .try(Joi.string().trim(), Joi.array().items(Joi.string().trim()))
        .optional(),
    whatYouWillLearn: Joi.alternatives()
        .try(Joi.array().items(Joi.string().trim()), Joi.string().trim())
        .optional(),
    requirements: Joi.alternatives()
        .try(Joi.array().items(Joi.string().trim()), Joi.string().trim())
        .optional(),
    field: Joi.string().trim().optional(),
    processName: Joi.string().trim().optional(),
    refundOptions: Joi.string().trim().optional(),
    level: Joi.string()
        .valid("beginner", "intermediate", "advanced", "all")
        .optional(),
    language: Joi.string().trim().optional(),
    isActive: Joi.alternatives()
        .try(
            Joi.boolean(),
            Joi.string()
                .valid("true", "false", "1", "0")
                .custom((value) => value === "true" || value === "1")
        )
        .optional(),
    isFeatured: Joi.alternatives()
        .try(
            Joi.boolean(),
            Joi.string()
                .valid("true", "false", "1", "0")
                .custom((value) => value === "true" || value === "1")
        )
        .optional(),
});

module.exports = {
    createCourseSchema,
    updateCourseSchema,
};
