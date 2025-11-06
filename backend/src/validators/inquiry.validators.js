const Joi = require("joi");
const { INQUIRY_STATUSES } = require("../constants/statuses");

const createInquirySchema = Joi.object({
    name: Joi.string().trim().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().trim().optional(),
    subject: Joi.string().trim().required(),
    message: Joi.string().required(),
    category: Joi.string()
        .valid("general", "course", "technical", "billing", "other")
        .default("general"),
});

const updateStatusSchema = Joi.object({
    status: Joi.string()
        .valid(...Object.values(INQUIRY_STATUSES))
        .required(),
});

const assignInquirySchema = Joi.object({
    adminId: Joi.string().hex().length(24).required(),
});

const respondSchema = Joi.object({
    message: Joi.string().required(),
});

const addNoteSchema = Joi.object({
    content: Joi.string().required(),
});

const updateInquirySchema = Joi.object({
    priority: Joi.string().valid("low", "medium", "high", "urgent").optional(),
    status: Joi.string()
        .valid(...Object.values(INQUIRY_STATUSES))
        .optional(),
});

module.exports = {
    createInquirySchema,
    updateStatusSchema,
    assignInquirySchema,
    respondSchema,
    addNoteSchema,
    updateInquirySchema,
};
