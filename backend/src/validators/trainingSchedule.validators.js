const Joi = require("joi");

const createTrainingScheduleSchema = Joi.object({
    scheduleName: Joi.string().trim().min(3).max(200).required().messages({
        "string.empty": "일정 이름을 입력해주세요",
        "any.required": "일정 이름은 필수입니다",
    }),
    startDate: Joi.date().iso().required().messages({
        "date.base": "시작일을 입력해주세요",
        "any.required": "시작일은 필수입니다",
    }),
    endDate: Joi.date().iso().min(Joi.ref("startDate")).required().messages({
        "date.base": "종료일을 입력해주세요",
        "date.min": "종료일은 시작일보다 늦어야 합니다",
        "any.required": "종료일은 필수입니다",
    }),
    availableSeats: Joi.number().integer().min(1).default(30).messages({
        "number.min": "좌석 수는 1 이상이어야 합니다",
    }),
    status: Joi.string().valid("upcoming", "ongoing", "completed", "cancelled").default("upcoming"),
    isActive: Joi.boolean().default(true),
});

const updateTrainingScheduleSchema = Joi.object({
    scheduleName: Joi.string().trim().min(3).max(200).optional(),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional(),
    availableSeats: Joi.number().integer().min(1).optional(),
    status: Joi.string().valid("upcoming", "ongoing", "completed", "cancelled").optional(),
    isActive: Joi.boolean().optional(),
});

module.exports = {
    createTrainingScheduleSchema,
    updateTrainingScheduleSchema,
};

