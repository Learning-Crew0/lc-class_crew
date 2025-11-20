const Joi = require("joi");
const { ALL_MEMBERSHIP_VALUES, GENDER_TYPES } = require("../constants/memberships");

const updateUserSchema = Joi.object({
    email: Joi.string().email().max(254).optional(),
    username: Joi.string().trim().min(3).max(50).optional(),
    fullName: Joi.string().trim().min(2).max(100).optional(),
    gender: Joi.string()
        .valid(...Object.values(GENDER_TYPES))
        .optional(),
    phone: Joi.string()
        .trim()
        .pattern(/^01[0-9]{9}$/)
        .optional(),
    dob: Joi.date().max("now").optional(),
    memberType: Joi.string()
        .valid(...ALL_MEMBERSHIP_VALUES)
        .optional(),
    profilePicture: Joi.string().uri().optional(),
});

const toggleUserStatusSchema = Joi.object({
    isActive: Joi.boolean().required(),
});

module.exports = {
    updateUserSchema,
    toggleUserStatusSchema,
};
