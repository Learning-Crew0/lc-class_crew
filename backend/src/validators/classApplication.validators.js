const Joi = require("joi");

const participantSchema = Joi.object({
    name: Joi.string().trim().required(),
    email: Joi.string().trim().email().required(),
    phone: Joi.string()
        .trim()
        .pattern(/^01[0-9]{9}$/)
        .required(),
    department: Joi.string().trim().optional(),
    position: Joi.string().trim().optional(),
});

const createClassApplicationSchema = Joi.object({
    userId: Joi.string().trim().optional(),
    applicantName: Joi.string().trim().required(),
    email: Joi.string().trim().email().required(),
    phone: Joi.string()
        .trim()
        .pattern(/^01[0-9]{9}$/)
        .required(),
    organization: Joi.string().trim().optional(),
    memberType: Joi.string()
        .valid("individual", "corporate_trainer", "employee", "job_seeker")
        .required(),
    courseId: Joi.string().trim().required(),
    scheduleId: Joi.string().trim().required(),
    courseName: Joi.string().trim().optional(),
    scheduleDate: Joi.string().trim().optional(),
    numberOfParticipants: Joi.number().min(1).optional(),
    participants: Joi.array().items(participantSchema).optional(),
    applicationPurpose: Joi.string().trim().optional(),
    specialRequests: Joi.string().trim().optional(),
    expectedPaymentMethod: Joi.string()
        .valid(
            "simple_payment",
            "card_payment",
            "bank_transfer",
            "account_transfer"
        )
        .optional(),
    paymentType: Joi.string().valid("personal", "corporate").optional(),
});

const updateApplicationStatusSchema = Joi.object({
    status: Joi.string()
        .valid("pending", "approved", "rejected", "completed", "cancelled")
        .required(),
    reviewNotes: Joi.string().trim().optional(),
    rejectionReason: Joi.string().trim().optional(),
});

module.exports = {
    createClassApplicationSchema,
    updateApplicationStatusSchema,
};

