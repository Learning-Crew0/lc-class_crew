const Joi = require("joi");

const createSettingSchema = Joi.object({
  key: Joi.string().trim().required(),
  value: Joi.any().required(),
  description: Joi.string().optional(),
  category: Joi.string()
    .valid("general", "email", "payment", "security", "features", "other")
    .default("general"),
  isPublic: Joi.boolean().default(false),
});

const updateSettingSchema = Joi.object({
  value: Joi.any().optional(),
  description: Joi.string().optional(),
  category: Joi.string()
    .valid("general", "email", "payment", "security", "features", "other")
    .optional(),
  isPublic: Joi.boolean().optional(),
});

module.exports = {
  createSettingSchema,
  updateSettingSchema,
};
