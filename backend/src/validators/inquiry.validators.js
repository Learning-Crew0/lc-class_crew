const Joi = require("joi");

const createInquirySchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required().messages({
        "string.empty": "Name is required",
        "string.min": "Name must be at least 2 characters",
        "string.max": "Name cannot exceed 100 characters",
        "any.required": "Name is required",
    }),
    email: Joi.string().email().required().messages({
        "string.email": "Please provide a valid email",
        "any.required": "Email is required",
    }),
    phone: Joi.string()
        .pattern(
            /^01[0-9]{9,10}$|^[6-9][0-9]{9}$|^91[6-9][0-9]{9}$|^82[0-9]{9,10}$|^\+?[0-9]{10,15}$/
        )
        .required()
        .messages({
            "string.pattern.base": "Phone must be valid format",
            "any.required": "Phone is required",
        }),
    company: Joi.string().trim().max(200).optional().allow(""),
    countryCode: Joi.string().optional().default("82"),
    category: Joi.string()
        .valid(
            "General Question",
            "Technical Support",
            "Program Inquiry",
            "Payment Issue",
            "Partnership",
            "Other"
        )
        .required()
        .messages({
            "any.only":
                "Category must be one of: General Question, Technical Support, Program Inquiry, Payment Issue, Partnership, Other",
            "any.required": "Category is required",
        }),
    subject: Joi.string().trim().max(200).required().messages({
        "string.empty": "Subject is required",
        "string.max": "Subject cannot exceed 200 characters",
        "any.required": "Subject is required",
    }),
    message: Joi.string().min(10).max(2000).required().messages({
        "string.min": "Message must be at least 10 characters",
        "string.max": "Message cannot exceed 2000 characters",
        "any.required": "Message is required",
    }),
    attachmentUrl: Joi.string().uri().optional().allow(""),
    attachmentOriginalName: Joi.string().optional().allow(""),
    agreeToTerms: Joi.boolean().valid(true).required().messages({
        "any.only": "You must agree to the terms",
        "any.required": "Agreement to terms is required",
    }),
});

const updateStatusSchema = Joi.object({
    status: Joi.string()
        .valid("pending", "in_progress", "resolved", "closed")
        .required(),
});

const assignInquirySchema = Joi.object({
    adminId: Joi.string().hex().length(24).required(),
});

const respondSchema = Joi.object({
    message: Joi.string().required(),
    attachments: Joi.array().items(Joi.string().uri()).optional().default([]),
});

const addNoteSchema = Joi.object({
    content: Joi.string().required(),
});

const updateInquirySchema = Joi.object({
    priority: Joi.string().valid("low", "medium", "high", "urgent").optional(),
    status: Joi.string()
        .valid("pending", "in_progress", "resolved", "closed")
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
