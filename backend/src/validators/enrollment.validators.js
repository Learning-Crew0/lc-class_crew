const Joi = require("joi");
const { ENROLLMENT_STATUSES } = require("../constants/statuses");

const createEnrollmentSchema = Joi.object({
    courseId: Joi.string().hex().length(24).required(),
});

const updateStatusSchema = Joi.object({
    status: Joi.string()
        .valid(...Object.values(ENROLLMENT_STATUSES))
        .required(),
});

const markAttendanceSchema = Joi.object({
    sessionId: Joi.string().hex().length(24).required(),
    attended: Joi.boolean().required(),
});

const addAssessmentSchema = Joi.object({
    type: Joi.string()
        .valid("assignment", "test", "quiz", "project")
        .required(),
    title: Joi.string().trim().required(),
    score: Joi.number().min(0).max(100).required(),
    maxScore: Joi.number().positive().default(100),
});

module.exports = {
    createEnrollmentSchema,
    updateStatusSchema,
    markAttendanceSchema,
    addAssessmentSchema,
};
