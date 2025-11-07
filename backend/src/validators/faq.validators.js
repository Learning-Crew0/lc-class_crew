const Joi = require("joi");

const createFAQCategorySchema = Joi.object({
    key: Joi.string()
        .trim()
        .lowercase()
        .pattern(/^[a-z0-9/_-]+$/)
        .required(),
    label: Joi.string().trim().required(),
    description: Joi.string().trim().optional(),
    order: Joi.alternatives()
        .try(
            Joi.number().min(0),
            Joi.string()
                .trim()
                .pattern(/^\d+$/)
                .custom((value) => parseInt(value, 10))
        )
        .optional(),
    icon: Joi.string().trim().optional(),
    isActive: Joi.alternatives()
        .try(
            Joi.boolean(),
            Joi.string()
                .valid("true", "false", "1", "0")
                .custom((value) => value === "true" || value === "1")
        )
        .default(true),
});

const updateFAQCategorySchema = Joi.object({
    label: Joi.string().trim().optional(),
    description: Joi.string().trim().optional(),
    order: Joi.alternatives()
        .try(
            Joi.number().min(0),
            Joi.string()
                .trim()
                .pattern(/^\d+$/)
                .custom((value) => parseInt(value, 10))
        )
        .optional(),
    icon: Joi.string().trim().optional(),
    isActive: Joi.alternatives()
        .try(
            Joi.boolean(),
            Joi.string()
                .valid("true", "false", "1", "0")
                .custom((value) => value === "true" || value === "1")
        )
        .optional(),
});

const createFAQSchema = Joi.object({
    question: Joi.string().trim().min(5).max(500).required(),
    answer: Joi.string().trim().min(10).required(),
    category: Joi.string().trim().required(),
    categoryLabel: Joi.string().trim().optional(),
    order: Joi.alternatives()
        .try(
            Joi.number().min(0),
            Joi.string()
                .trim()
                .pattern(/^\d+$/)
                .custom((value) => parseInt(value, 10))
        )
        .optional(),
    tags: Joi.alternatives()
        .try(
            Joi.array().items(Joi.string().trim()),
            Joi.string()
                .trim()
                .custom((value) => value.split(",").map((t) => t.trim()))
        )
        .optional(),
    relatedFAQs: Joi.alternatives()
        .try(
            Joi.array().items(Joi.string().trim()),
            Joi.string()
                .trim()
                .custom((value) => value.split(",").map((t) => t.trim()))
        )
        .optional(),
    relatedArticles: Joi.alternatives()
        .try(
            Joi.array().items(Joi.string().trim()),
            Joi.string()
                .trim()
                .custom((value) => value.split(",").map((t) => t.trim()))
        )
        .optional(),
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

const updateFAQSchema = Joi.object({
    question: Joi.string().trim().min(5).max(500).optional(),
    answer: Joi.string().trim().min(10).optional(),
    category: Joi.string().trim().optional(),
    categoryLabel: Joi.string().trim().optional(),
    order: Joi.alternatives()
        .try(
            Joi.number().min(0),
            Joi.string()
                .trim()
                .pattern(/^\d+$/)
                .custom((value) => parseInt(value, 10))
        )
        .optional(),
    tags: Joi.alternatives()
        .try(
            Joi.array().items(Joi.string().trim()),
            Joi.string()
                .trim()
                .custom((value) => value.split(",").map((t) => t.trim()))
        )
        .optional(),
    relatedFAQs: Joi.alternatives()
        .try(
            Joi.array().items(Joi.string().trim()),
            Joi.string()
                .trim()
                .custom((value) => value.split(",").map((t) => t.trim()))
        )
        .optional(),
    relatedArticles: Joi.alternatives()
        .try(
            Joi.array().items(Joi.string().trim()),
            Joi.string()
                .trim()
                .custom((value) => value.split(",").map((t) => t.trim()))
        )
        .optional(),
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

const markHelpfulSchema = Joi.object({
    helpful: Joi.boolean().required(),
});

const bulkDeleteSchema = Joi.object({
    ids: Joi.array().items(Joi.string().trim()).min(1).required(),
});

module.exports = {
    createFAQCategorySchema,
    updateFAQCategorySchema,
    createFAQSchema,
    updateFAQSchema,
    markHelpfulSchema,
    bulkDeleteSchema,
};
