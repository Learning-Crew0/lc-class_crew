const Joi = require("joi");
const { CATEGORY_SLUGS, POSITION_SLUGS } = require("../constants/categories");
const { COURSE_DISPLAY_TAG_VALUES } = require("../constants/courseTags");

const createCourseSchema = Joi.object({
    title: Joi.string().trim().min(3).max(200).required().messages({
        "string.empty": "코스 제목을 입력해주세요",
        "string.min": "코스 제목은 최소 3자 이상이어야 합니다",
        "any.required": "코스 제목은 필수입니다",
    }),
    shortDescription: Joi.string().trim().max(500).optional(),
    longDescription: Joi.string().trim().optional(),
    description: Joi.string().trim().optional(),
    // Category - can be either ObjectId (MongoDB) or slug (constants)
    category: Joi.alternatives()
        .try(
            Joi.string().hex().length(24), // MongoDB ObjectId
            Joi.string()
                .trim()
                .valid(...CATEGORY_SLUGS) // Category slug
        )
        .required()
        .messages({
            "string.empty": "카테고리를 선택해주세요",
            "any.required": "카테고리는 필수입니다",
            "alternatives.match": "유효한 카테고리를 선택해주세요",
        }),
    // Subcategory - MongoDB ObjectId (optional)
    subcategory: Joi.string()
        .hex()
        .length(24)
        .optional()
        .messages({
            "string.hex": "유효한 서브카테고리 ID를 입력해주세요",
            "string.length": "유효한 서브카테고리 ID를 입력해주세요",
        }),
    // Position slug (optional)
    position: Joi.string()
        .trim()
        .valid(...POSITION_SLUGS)
        .optional()
        .messages({
            "any.only": "유효한 직급/직책을 선택해주세요",
        }),
    tagText: Joi.string().trim().max(50).optional(),
    tagColor: Joi.string().trim().default("text-blue-500"),
    tags: Joi.alternatives()
        .try(Joi.array().items(Joi.string().trim()), Joi.string().trim())
        .optional(),
    displayTag: Joi.string()
        .valid(...COURSE_DISPLAY_TAG_VALUES)
        .default("ALL")
        .optional()
        .messages({
            "any.only": "displayTag must be one of NEWEST, POPULAR, or ALL",
        }),
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
    // NEW FIELDS for Course Management System
    promotion: Joi.alternatives()
        .try(
            Joi.array()
                .items(
                    Joi.string()
                        .valid(
                            "group-listening",
                            "early-bird-discount",
                            "group-discount"
                        )
                        .allow("")
                )
                .custom((arr) => arr.filter(Boolean)), // Filter out empty strings
            Joi.string().custom((value) => {
                // Handle empty string
                if (!value || !value.trim()) {
                    return [];
                }
                // Handle JSON-stringified array or comma-separated string
                if (typeof value === "string") {
                    // Try JSON.parse first (for FormData arrays like '["early-bird-discount"]')
                    try {
                        const parsed = JSON.parse(value);
                        if (Array.isArray(parsed)) {
                            return parsed.filter(Boolean); // Filter out empty strings
                        }
                        // If parsed but not array, wrap it
                        return parsed ? [parsed] : [];
                    } catch (e) {
                        // Fall back to comma-split for simple strings like "tag1,tag2,tag3"
                        return value
                            .split(",")
                            .map((v) => v.trim())
                            .filter(Boolean);
                    }
                }
                return [];
            })
        )
        .optional()
        .default([]),
    refundEligible: Joi.alternatives()
        .try(
            Joi.boolean(),
            Joi.string()
                .valid("true", "false", "1", "0")
                .custom((value) => value === "true" || value === "1")
        )
        .optional()
        .default(true),
    courseNameFormatted: Joi.string().trim().max(200).optional(),
    thumbnailOrder: Joi.object({
        newest: Joi.number().default(9999),
        popular: Joi.number().default(9999),
        all: Joi.number().default(9999),
    }).optional(),
    currentStatus: Joi.string()
        .valid(
            "upcoming",
            "recruiting",
            "closed",
            "confirmed",
            "cancelled",
            "in-progress",
            "completed"
        )
        .optional()
        .default("upcoming"),
    mainImage: Joi.string().trim().optional(),
    hoverImage: Joi.string().trim().optional(),
    image: Joi.string().trim().optional(),
});

const updateCourseSchema = Joi.object({
    title: Joi.string().trim().min(3).max(200).optional(),
    shortDescription: Joi.string().trim().max(500).optional(),
    longDescription: Joi.string().trim().optional(),
    description: Joi.string().trim().optional(),
    // Category - MongoDB ObjectId (24 character hex string)
    category: Joi.string()
        .trim()
        .regex(/^[0-9a-fA-F]{24}$/)
        .optional()
        .messages({
            "string.pattern.base": "유효한 카테고리를 선택해주세요",
        }),
    // Subcategory - MongoDB ObjectId (optional)
    subcategory: Joi.string()
        .hex()
        .length(24)
        .optional()
        .allow(null, "")
        .messages({
            "string.hex": "유효한 서브카테고리 ID를 입력해주세요",
            "string.length": "유효한 서브카테고리 ID를 입력해주세요",
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
    displayTag: Joi.string()
        .valid(...COURSE_DISPLAY_TAG_VALUES)
        .optional()
        .messages({
            "any.only": "displayTag must be one of NEWEST, POPULAR, or ALL",
        }),
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
    // NEW FIELDS for Course Management System
    promotion: Joi.alternatives()
        .try(
            Joi.array()
                .items(
                    Joi.string()
                        .valid(
                            "group-listening",
                            "early-bird-discount",
                            "group-discount"
                        )
                        .allow("")
                )
                .custom((arr) => arr.filter(Boolean)), // Filter out empty strings
            Joi.string().custom((value) => {
                // Handle empty string
                if (!value || !value.trim()) {
                    return [];
                }
                // Handle JSON-stringified array or comma-separated string
                if (typeof value === "string") {
                    // Try JSON.parse first (for FormData arrays like '["early-bird-discount"]')
                    try {
                        const parsed = JSON.parse(value);
                        if (Array.isArray(parsed)) {
                            return parsed.filter(Boolean); // Filter out empty strings
                        }
                        // If parsed but not array, wrap it
                        return parsed ? [parsed] : [];
                    } catch (e) {
                        // Fall back to comma-split for simple strings like "tag1,tag2,tag3"
                        return value
                            .split(",")
                            .map((v) => v.trim())
                            .filter(Boolean);
                    }
                }
                return [];
            })
        )
        .optional(),
    refundEligible: Joi.alternatives()
        .try(
            Joi.boolean(),
            Joi.string()
                .valid("true", "false", "1", "0")
                .custom((value) => value === "true" || value === "1")
        )
        .optional(),
    courseNameFormatted: Joi.string().trim().max(200).optional(),
    thumbnailOrder: Joi.object({
        newest: Joi.number().optional(),
        popular: Joi.number().optional(),
        all: Joi.number().optional(),
    }).optional(),
    currentStatus: Joi.string()
        .valid(
            "upcoming",
            "recruiting",
            "closed",
            "confirmed",
            "cancelled",
            "in-progress",
            "completed"
        )
        .optional(),
    mainImage: Joi.string().trim().optional(),
    hoverImage: Joi.string().trim().optional(),
    image: Joi.string().trim().optional(),
});

module.exports = {
    createCourseSchema,
    updateCourseSchema,
};
