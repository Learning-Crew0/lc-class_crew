const Joi = require("joi");

const createProductCategorySchema = Joi.object({
    title: Joi.string().trim().max(100).required().messages({
        "string.empty": "Category title is required",
        "string.max": "Category title cannot exceed 100 characters",
        "any.required": "Category title is required",
    }),
    description: Joi.string().trim().max(500).optional().allow("").messages({
        "string.max": "Description cannot exceed 500 characters",
    }),
    icon: Joi.string().optional().allow(""),
    order: Joi.number().default(0),
    isActive: Joi.boolean().default(true),
});

const updateProductCategorySchema = Joi.object({
    title: Joi.string().trim().max(100).optional().messages({
        "string.max": "Category title cannot exceed 100 characters",
    }),
    description: Joi.string().trim().max(500).optional().allow("").messages({
        "string.max": "Description cannot exceed 500 characters",
    }),
    icon: Joi.string().optional().allow(""),
    order: Joi.number().optional(),
    isActive: Joi.boolean().optional(),
}).min(1);

module.exports = {
    createProductCategorySchema,
    updateProductCategorySchema,
};
