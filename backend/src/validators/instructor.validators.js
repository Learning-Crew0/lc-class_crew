const Joi = require("joi");

const createInstructorSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required().messages({
        "string.empty": "강사 이름을 입력해주세요",
        "any.required": "강사 이름은 필수입니다",
    }),
    bio: Joi.string().trim().optional(),
    professionalField: Joi.string().trim().optional(),
    // 학력 및 경력 (Education and Career)
    education: Joi.alternatives().try(
        Joi.array().items(Joi.string().trim()),
        Joi.string().trim()
    ).optional(),
    // 전문분야 (Professional Expertise)
    expertise: Joi.alternatives().try(
        Joi.array().items(Joi.string().trim()),
        Joi.string().trim()
    ).optional(),
    // 자격 및 저서 (Certificates and Publications)
    certificates: Joi.alternatives().try(
        Joi.array().items(Joi.string().trim()),
        Joi.string().trim()
    ).optional(),
    // 출강이력 (Teaching Experience)
    experience: Joi.alternatives().try(
        Joi.array().items(Joi.string().trim()),
        Joi.string().trim()
    ).optional(),
    // Legacy field - kept for backward compatibility
    attendanceHistory: Joi.alternatives().try(
        Joi.array().items(Joi.string().trim()),
        Joi.string().trim()
    ).optional(),
});

const updateInstructorSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).optional(),
    bio: Joi.string().trim().optional(),
    professionalField: Joi.string().trim().optional(),
    // 학력 및 경력 (Education and Career)
    education: Joi.alternatives().try(
        Joi.array().items(Joi.string().trim()),
        Joi.string().trim()
    ).optional(),
    // 전문분야 (Professional Expertise)
    expertise: Joi.alternatives().try(
        Joi.array().items(Joi.string().trim()),
        Joi.string().trim()
    ).optional(),
    // 자격 및 저서 (Certificates and Publications)
    certificates: Joi.alternatives().try(
        Joi.array().items(Joi.string().trim()),
        Joi.string().trim()
    ).optional(),
    // 출강이력 (Teaching Experience)
    experience: Joi.alternatives().try(
        Joi.array().items(Joi.string().trim()),
        Joi.string().trim()
    ).optional(),
    // Legacy field - kept for backward compatibility
    attendanceHistory: Joi.alternatives().try(
        Joi.array().items(Joi.string().trim()),
        Joi.string().trim()
    ).optional(),
});

module.exports = {
    createInstructorSchema,
    updateInstructorSchema,
};

