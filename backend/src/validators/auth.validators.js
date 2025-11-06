const Joi = require("joi");
const { MEMBERSHIP_TYPES } = require("../constants/memberships");

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  phone: Joi.string().trim().optional(),
  membershipType: Joi.string()
    .valid(...Object.values(MEMBERSHIP_TYPES))
    .required(),
  companyName: Joi.string().trim().optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const updateProfileSchema = Joi.object({
  firstName: Joi.string().trim().optional(),
  lastName: Joi.string().trim().optional(),
  phone: Joi.string().trim().optional(),
  companyName: Joi.string().trim().optional(),
  profilePicture: Joi.string().uri().optional(),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
};
