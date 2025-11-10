const Joi = require("joi");

const createProductSchema = Joi.object({
    name: Joi.string().trim().required().messages({
        "string.empty": "Product name is required",
        "any.required": "Product name is required",
    }),
    slug: Joi.string().trim().lowercase().optional(),
    description: Joi.string().required().messages({
        "string.empty": "Product description is required",
        "any.required": "Product description is required",
    }),
    shortDescription: Joi.string().max(200).optional().allow(""),
    price: Joi.number().min(0).required().messages({
        "number.base": "Price must be a number",
        "number.min": "Price cannot be negative",
        "any.required": "Price is required",
    }),
    compareAtPrice: Joi.number().min(0).optional(),
    category: Joi.string().trim().optional().allow(""),
    tags: Joi.alternatives()
        .try(
            Joi.array().items(Joi.string()),
            Joi.string().custom((value) => value.split(",").map((t) => t.trim()))
        )
        .optional(),
    images: Joi.array().items(Joi.string()).optional(),
    thumbnail: Joi.string().optional().allow(""),
    stock: Joi.object({
        quantity: Joi.number().min(0).default(0),
        trackInventory: Joi.boolean().default(true),
        allowBackorder: Joi.boolean().default(false),
    }).optional(),
    isFeatured: Joi.boolean().optional(),
    isPublished: Joi.boolean().optional(),
    specifications: Joi.object().optional(),
});

const updateProductSchema = Joi.object({
    name: Joi.string().trim().optional(),
    slug: Joi.string().trim().lowercase().optional(),
    description: Joi.string().optional(),
    shortDescription: Joi.string().max(200).optional().allow(""),
    price: Joi.number().min(0).optional(),
    compareAtPrice: Joi.number().min(0).optional(),
    category: Joi.string().trim().optional().allow(""),
    tags: Joi.alternatives()
        .try(
            Joi.array().items(Joi.string()),
            Joi.string().custom((value) => value.split(",").map((t) => t.trim()))
        )
        .optional(),
    images: Joi.array().items(Joi.string()).optional(),
    thumbnail: Joi.string().optional().allow(""),
    stock: Joi.object({
        quantity: Joi.number().min(0),
        trackInventory: Joi.boolean(),
        allowBackorder: Joi.boolean(),
    }).optional(),
    isFeatured: Joi.boolean().optional(),
    isPublished: Joi.boolean().optional(),
    specifications: Joi.object().optional(),
}).min(1);

const updateStockSchema = Joi.object({
    quantity: Joi.number().min(0).required().messages({
        "number.base": "Quantity must be a number",
        "number.min": "Quantity cannot be negative",
        "any.required": "Quantity is required",
    }),
});

module.exports = {
    createProductSchema,
    updateProductSchema,
    updateStockSchema,
};
