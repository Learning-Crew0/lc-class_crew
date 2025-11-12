const Joi = require("joi");

// Custom validator for image URLs - accepts both full URLs and relative paths
const imageUrlValidator = Joi.string().custom((value, helpers) => {
    if (value.startsWith("http://") || value.startsWith("https://")) {
        return value;
    }
    if (value.startsWith("/")) {
        return value;
    }
    return helpers.error("any.invalid");
}, "Image URL or path validator");

const createProductSchema = Joi.object({
    name: Joi.string().trim().max(200).required().messages({
        "string.empty": "Product name is required",
        "string.max": "Product name cannot exceed 200 characters",
        "any.required": "Product name is required",
    }),
    description: Joi.string().max(2000).required().messages({
        "string.empty": "Product description is required",
        "string.max": "Description cannot exceed 2000 characters",
        "any.required": "Product description is required",
    }),
    category: Joi.object({
        _id: Joi.string().required().messages({
            "any.required": "Category ID is required",
        }),
        title: Joi.string().required().messages({
            "any.required": "Category title is required",
        }),
    })
        .required()
        .messages({
            "any.required": "Category is required",
        }),
    baseCost: Joi.number().min(0).required().messages({
        "number.base": "Base cost must be a number",
        "number.min": "Base cost cannot be negative",
        "any.required": "Base cost is required",
    }),
    discountRate: Joi.number().min(0).max(100).default(0).messages({
        "number.base": "Discount rate must be a number",
        "number.min": "Discount rate cannot be negative",
        "number.max": "Discount rate cannot exceed 100%",
    }),
    availableQuantity: Joi.number().min(0).default(0).messages({
        "number.base": "Available quantity must be a number",
        "number.min": "Available quantity cannot be negative",
    }),
    images: Joi.array().items(imageUrlValidator).min(1).required().messages({
        "array.min": "At least one image is required",
        "any.required": "Images are required",
    }),
    isActive: Joi.boolean().default(true),
});

const updateProductSchema = Joi.object({
    name: Joi.string().trim().max(200).optional().messages({
        "string.max": "Product name cannot exceed 200 characters",
    }),
    description: Joi.string().max(2000).optional().messages({
        "string.max": "Description cannot exceed 2000 characters",
    }),
    category: Joi.object({
        _id: Joi.string().required(),
        title: Joi.string().required(),
    }).optional(),
    baseCost: Joi.number().min(0).optional().messages({
        "number.base": "Base cost must be a number",
        "number.min": "Base cost cannot be negative",
    }),
    discountRate: Joi.number().min(0).max(100).optional().messages({
        "number.base": "Discount rate must be a number",
        "number.min": "Discount rate cannot be negative",
        "number.max": "Discount rate cannot exceed 100%",
    }),
    availableQuantity: Joi.number().min(0).optional().messages({
        "number.base": "Available quantity must be a number",
        "number.min": "Available quantity cannot be negative",
    }),
    images: Joi.array().items(imageUrlValidator).min(1).optional().messages({
        "array.min": "At least one image is required",
    }),
    isActive: Joi.boolean().optional(),
}).min(1);

const updateStockSchema = Joi.object({
    availableQuantity: Joi.number().min(0).required().messages({
        "number.base": "Available quantity must be a number",
        "number.min": "Available quantity cannot be negative",
        "any.required": "Available quantity is required",
    }),
});

module.exports = {
    createProductSchema,
    updateProductSchema,
    updateStockSchema,
};
