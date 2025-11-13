const Joi = require("joi");

/**
 * Validator for creating a coalition application
 */
const createCoalitionSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required().messages({
        "string.empty": "Name is required",
        "string.min": "Name must be at least 2 characters",
        "string.max": "Name cannot exceed 100 characters",
        "any.required": "Name is required",
    }),
    affiliation: Joi.string().trim().min(2).max(200).required().messages({
        "string.empty": "Affiliation is required",
        "string.min": "Affiliation must be at least 2 characters",
        "string.max": "Affiliation cannot exceed 200 characters",
        "any.required": "Affiliation is required",
    }),
    field: Joi.string().trim().min(2).max(200).required().messages({
        "string.empty": "Field is required",
        "string.min": "Field must be at least 2 characters",
        "string.max": "Field cannot exceed 200 characters",
        "any.required": "Field is required",
    }),
    contact: Joi.string()
        .pattern(/^01[0-1]\d{8}$/)
        .required()
        .messages({
            "string.pattern.base":
                "Contact number must be 11 digits (Korean format: 010XXXXXXXX)",
            "any.required": "Contact number is required",
        }),
    email: Joi.string().email().lowercase().required().messages({
        "string.email": "Please provide a valid email",
        "any.required": "Email is required",
    }),
});

/**
 * Validator for updating coalition status
 */
const updateStatusSchema = Joi.object({
    status: Joi.string()
        .valid("pending", "approved", "rejected")
        .required()
        .messages({
            "any.only": "Status must be one of: pending, approved, rejected",
            "any.required": "Status is required",
        }),
    adminNotes: Joi.string().max(1000).optional().allow("").messages({
        "string.max": "Admin notes cannot exceed 1000 characters",
    }),
});

/**
 * Validator for query parameters when getting all applications
 */
const getCoalitionsQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    status: Joi.string().valid("pending", "approved", "rejected").optional(),
    search: Joi.string().trim().optional(),
    sortBy: Joi.string()
        .valid("createdAt", "name", "affiliation", "status")
        .default("createdAt"),
    sortOrder: Joi.string().valid("asc", "desc").default("desc"),
});

module.exports = {
    createCoalitionSchema,
    updateStatusSchema,
    getCoalitionsQuerySchema,
};

