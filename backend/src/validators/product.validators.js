const Joi = require("joi");

const createProductSchema = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().required(),
  shortDescription: Joi.string().max(200).optional(),
  price: Joi.number().min(0).required(),
  compareAtPrice: Joi.number().min(0).optional(),
  category: Joi.string().trim().optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  thumbnail: Joi.string().uri().optional(),
  stock: Joi.object({
    quantity: Joi.number().min(0).default(0),
    trackInventory: Joi.boolean().default(true),
  }).optional(),
  sku: Joi.string().trim().optional(),
  weight: Joi.object({
    value: Joi.number().positive(),
    unit: Joi.string().valid("g", "kg", "lb", "oz").default("kg"),
  }).optional(),
  dimensions: Joi.object({
    length: Joi.number().positive(),
    width: Joi.number().positive(),
    height: Joi.number().positive(),
    unit: Joi.string().valid("cm", "in").default("cm"),
  }).optional(),
  isPublished: Joi.boolean().default(false),
  isFeatured: Joi.boolean().default(false),
});

const updateProductSchema = Joi.object({
  name: Joi.string().trim().optional(),
  description: Joi.string().optional(),
  shortDescription: Joi.string().max(200).optional(),
  price: Joi.number().min(0).optional(),
  compareAtPrice: Joi.number().min(0).optional(),
  category: Joi.string().trim().optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  thumbnail: Joi.string().uri().optional(),
  stock: Joi.object({
    quantity: Joi.number().min(0),
    trackInventory: Joi.boolean(),
  }).optional(),
  sku: Joi.string().trim().optional(),
  weight: Joi.object({
    value: Joi.number().positive(),
    unit: Joi.string().valid("g", "kg", "lb", "oz"),
  }).optional(),
  dimensions: Joi.object({
    length: Joi.number().positive(),
    width: Joi.number().positive(),
    height: Joi.number().positive(),
    unit: Joi.string().valid("cm", "in"),
  }).optional(),
  isPublished: Joi.boolean().optional(),
  isFeatured: Joi.boolean().optional(),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
};
