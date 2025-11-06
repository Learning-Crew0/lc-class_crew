const Joi = require("joi");

const addToCartSchema = Joi.object({
  productId: Joi.string().hex().length(24).required(),
  quantity: Joi.number().positive().default(1),
});

const updateCartItemSchema = Joi.object({
  quantity: Joi.number().positive().required(),
});

module.exports = {
  addToCartSchema,
  updateCartItemSchema,
};
