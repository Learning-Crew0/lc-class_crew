const Joi = require("joi");

const createBannerSchema = Joi.object({
  title: Joi.string().trim().required(),
  subtitle: Joi.string().trim().optional(),
  description: Joi.string().optional(),
  image: Joi.string().uri().required(),
  mobileImage: Joi.string().uri().optional(),
  link: Joi.object({
    url: Joi.string().uri().optional(),
    text: Joi.string().optional(),
    openInNewTab: Joi.boolean().default(false),
  }).optional(),
  position: Joi.string()
    .valid("home-hero", "home-secondary", "courses", "products", "sidebar")
    .default("home-hero"),
  order: Joi.number().default(0),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  isActive: Joi.boolean().default(true),
  backgroundColor: Joi.string().default("#ffffff"),
  textColor: Joi.string().default("#000000"),
});

const updateBannerSchema = Joi.object({
  title: Joi.string().trim().optional(),
  subtitle: Joi.string().trim().optional(),
  description: Joi.string().optional(),
  image: Joi.string().uri().optional(),
  mobileImage: Joi.string().uri().optional(),
  link: Joi.object({
    url: Joi.string().uri(),
    text: Joi.string(),
    openInNewTab: Joi.boolean(),
  }).optional(),
  position: Joi.string()
    .valid("home-hero", "home-secondary", "courses", "products", "sidebar")
    .optional(),
  order: Joi.number().optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  isActive: Joi.boolean().optional(),
  backgroundColor: Joi.string().optional(),
  textColor: Joi.string().optional(),
});

module.exports = {
  createBannerSchema,
  updateBannerSchema,
};
