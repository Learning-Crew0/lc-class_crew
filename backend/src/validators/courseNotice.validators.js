const Joi = require("joi");

const createCourseNoticeSchema = Joi.object({
    title: Joi.string().trim().min(2).max(200).optional(),
    noticeDesc: Joi.string().trim().optional(),
    isActive: Joi.boolean().default(true),
    priority: Joi.number().integer().min(0).default(0),
    expiresAt: Joi.date().iso().optional(),
});

const updateCourseNoticeSchema = Joi.object({
    title: Joi.string().trim().min(2).max(200).optional(),
    noticeDesc: Joi.string().trim().optional(),
    isActive: Joi.boolean().optional(),
    priority: Joi.number().integer().min(0).optional(),
    expiresAt: Joi.date().iso().allow(null).optional(),
});

module.exports = {
    createCourseNoticeSchema,
    updateCourseNoticeSchema,
};

