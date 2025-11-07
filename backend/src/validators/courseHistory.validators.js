const Joi = require("joi");

const personalHistoryInquirySchema = Joi.object({
    phoneNumber: Joi.string()
        .trim()
        .pattern(/^01[0-9]{9}$/)
        .required(),
    email: Joi.string().trim().email().required(),
    name: Joi.string().trim().min(2).required(),
});

const corporateHistoryInquirySchema = Joi.object({
    companyName: Joi.string().trim().required(),
    companyRegistrationNumber: Joi.string()
        .trim()
        .pattern(/^\d{10}$/)
        .optional(),
    contactPerson: Joi.string().trim().required(),
    contactPhone: Joi.string()
        .trim()
        .pattern(/^01[0-9]{9}$/)
        .required(),
    contactEmail: Joi.string().trim().email().required(),
    verificationCode: Joi.string().trim().optional(),
    department: Joi.string().trim().optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
});

const requestVerificationSchema = Joi.object({
    contactEmail: Joi.string().trim().email().required(),
    companyName: Joi.string().trim().required(),
});

module.exports = {
    personalHistoryInquirySchema,
    corporateHistoryInquirySchema,
    requestVerificationSchema,
};

