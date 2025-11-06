const Joi = require("joi");

const createNoticeSchema = Joi.object({
    title: Joi.string().trim().required(),
    content: Joi.string().required(),
    type: Joi.string()
        .valid("info", "warning", "success", "error", "announcement")
        .default("info"),
    priority: Joi.string().valid("low", "medium", "high").default("medium"),
    targetAudience: Joi.string()
        .valid("all", "users", "students", "specific")
        .default("all"),
    targetUsers: Joi.array().items(Joi.string().hex().length(24)).optional(),
    publishedAt: Joi.date().optional(),
    expiresAt: Joi.date().optional(),
    isPublished: Joi.boolean().default(false),
    isPinned: Joi.boolean().default(false),
    attachments: Joi.array()
        .items(
            Joi.object({
                filename: Joi.string().required(),
                url: Joi.string().uri().required(),
                fileType: Joi.string().optional(),
            })
        )
        .optional(),
});

const updateNoticeSchema = Joi.object({
    title: Joi.string().trim().optional(),
    content: Joi.string().optional(),
    type: Joi.string()
        .valid("info", "warning", "success", "error", "announcement")
        .optional(),
    priority: Joi.string().valid("low", "medium", "high").optional(),
    targetAudience: Joi.string()
        .valid("all", "users", "students", "specific")
        .optional(),
    targetUsers: Joi.array().items(Joi.string().hex().length(24)).optional(),
    publishedAt: Joi.date().optional(),
    expiresAt: Joi.date().optional(),
    isPublished: Joi.boolean().optional(),
    isPinned: Joi.boolean().optional(),
    attachments: Joi.array()
        .items(
            Joi.object({
                filename: Joi.string(),
                url: Joi.string().uri(),
                fileType: Joi.string(),
            })
        )
        .optional(),
});

module.exports = {
    createNoticeSchema,
    updateNoticeSchema,
};
