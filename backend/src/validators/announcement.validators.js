const Joi = require("joi");

const createAnnouncementSchema = Joi.object({
    title: Joi.string().trim().min(3).max(200).required(),
    content: Joi.string().trim().min(10).required(),
    category: Joi.string()
        .valid("notice", "event", "system", "urgent")
        .default("notice"),
    tags: Joi.alternatives()
        .try(
            Joi.array().items(Joi.string().trim()),
            Joi.string()
                .trim()
                .custom((value) => value.split(",").map((t) => t.trim()))
        )
        .optional(),
    isImportant: Joi.alternatives()
        .try(
            Joi.boolean(),
            Joi.string()
                .valid("true", "false", "1", "0")
                .custom((value) => value === "true" || value === "1")
        )
        .default(false),
    isPinned: Joi.alternatives()
        .try(
            Joi.boolean(),
            Joi.string()
                .valid("true", "false", "1", "0")
                .custom((value) => value === "true" || value === "1")
        )
        .default(false),
    status: Joi.string().valid("published", "draft", "archived").optional(),
    publishedAt: Joi.date().optional(),
    expiresAt: Joi.date().optional(),
    authorName: Joi.string().trim().required(),
});

const updateAnnouncementSchema = Joi.object({
    title: Joi.string().trim().min(3).max(200).optional(),
    content: Joi.string().trim().min(10).optional(),
    category: Joi.string()
        .valid("notice", "event", "system", "urgent")
        .optional(),
    tags: Joi.alternatives()
        .try(
            Joi.array().items(Joi.string().trim()),
            Joi.string()
                .trim()
                .custom((value) => value.split(",").map((t) => t.trim()))
        )
        .optional(),
    isImportant: Joi.alternatives()
        .try(
            Joi.boolean(),
            Joi.string()
                .valid("true", "false", "1", "0")
                .custom((value) => value === "true" || value === "1")
        )
        .optional(),
    isPinned: Joi.alternatives()
        .try(
            Joi.boolean(),
            Joi.string()
                .valid("true", "false", "1", "0")
                .custom((value) => value === "true" || value === "1")
        )
        .optional(),
    status: Joi.string().valid("published", "draft", "archived").optional(),
    publishedAt: Joi.date().optional(),
    expiresAt: Joi.date().optional(),
});

const bulkDeleteSchema = Joi.object({
    ids: Joi.array().items(Joi.string().trim()).min(1).required(),
});

module.exports = {
    createAnnouncementSchema,
    updateAnnouncementSchema,
    bulkDeleteSchema,
};

