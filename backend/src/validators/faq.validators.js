const Joi = require("joi");

const createFAQSchema = Joi.object({
    question: Joi.string().trim().required(),
    answer: Joi.string().required(),
    category: Joi.string()
        .valid(
            "general",
            "courses",
            "enrollment",
            "payments",
            "technical",
            "certificates",
            "other"
        )
        .default("general"),
    order: Joi.number().default(0),
    isPublished: Joi.boolean().default(true),
    tags: Joi.array().items(Joi.string().trim()).optional(),
});

const updateFAQSchema = Joi.object({
    question: Joi.string().trim().optional(),
    answer: Joi.string().optional(),
    category: Joi.string()
        .valid(
            "general",
            "courses",
            "enrollment",
            "payments",
            "technical",
            "certificates",
            "other"
        )
        .optional(),
    order: Joi.number().optional(),
    isPublished: Joi.boolean().optional(),
    tags: Joi.array().items(Joi.string().trim()).optional(),
});

const markHelpfulSchema = Joi.object({
    helpful: Joi.boolean().required(),
});

module.exports = {
    createFAQSchema,
    updateFAQSchema,
    markHelpfulSchema,
};
