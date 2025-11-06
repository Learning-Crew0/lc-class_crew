const Joi = require("joi");

const createCourseSchema = Joi.object({
    title: Joi.string().trim().required(),
    description: Joi.string().required(),
    shortDescription: Joi.string().max(200).optional(),
    instructor: Joi.string().trim().required(),
    duration: Joi.object({
        value: Joi.number().positive().required(),
        unit: Joi.string()
            .valid("hours", "days", "weeks", "months")
            .default("weeks"),
    }).required(),
    price: Joi.number().min(0).required(),
    thumbnail: Joi.string().uri().optional(),
    images: Joi.array().items(Joi.string().uri()).optional(),
    category: Joi.string().trim().optional(),
    tags: Joi.array().items(Joi.string().trim()).optional(),
    level: Joi.string()
        .valid("beginner", "intermediate", "advanced")
        .default("beginner"),
    maxStudents: Joi.number().positive().default(30),
    startDate: Joi.date().required(),
    endDate: Joi.date().greater(Joi.ref("startDate")).required(),
    schedulePattern: Joi.object({
        daysOfWeek: Joi.array()
            .items(
                Joi.string().valid(
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday"
                )
            )
            .min(1)
            .required(),
        startTime: Joi.string()
            .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
            .required(),
        endTime: Joi.string()
            .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
            .required(),
    }).optional(),
    sessions: Joi.array()
        .items(
            Joi.object({
                sessionNumber: Joi.number().required(),
                title: Joi.string().trim().required(),
                date: Joi.date().required(),
                startTime: Joi.string().required(),
                endTime: Joi.string().required(),
                description: Joi.string().optional(),
            })
        )
        .optional(),
    prerequisites: Joi.array().items(Joi.string()).optional(),
    learningOutcomes: Joi.array().items(Joi.string()).optional(),
    certificateEligibility: Joi.object({
        enabled: Joi.boolean().default(true),
        criteria: Joi.object({
            minAttendance: Joi.number().min(0).max(100).default(80),
            minAssignmentScore: Joi.number().min(0).max(100).default(70),
            minTestScore: Joi.number().min(0).max(100).default(70),
        }),
    }).optional(),
    isPublished: Joi.boolean().default(false),
    isFeatured: Joi.boolean().default(false),
});

const updateCourseSchema = Joi.object({
    title: Joi.string().trim().optional(),
    description: Joi.string().optional(),
    shortDescription: Joi.string().max(200).optional(),
    instructor: Joi.string().trim().optional(),
    duration: Joi.object({
        value: Joi.number().positive(),
        unit: Joi.string().valid("hours", "days", "weeks", "months"),
    }).optional(),
    price: Joi.number().min(0).optional(),
    thumbnail: Joi.string().uri().optional(),
    images: Joi.array().items(Joi.string().uri()).optional(),
    category: Joi.string().trim().optional(),
    tags: Joi.array().items(Joi.string().trim()).optional(),
    level: Joi.string()
        .valid("beginner", "intermediate", "advanced")
        .optional(),
    maxStudents: Joi.number().positive().optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    schedulePattern: Joi.object({
        daysOfWeek: Joi.array().items(Joi.string()),
        startTime: Joi.string(),
        endTime: Joi.string(),
    }).optional(),
    sessions: Joi.array()
        .items(
            Joi.object({
                sessionNumber: Joi.number(),
                title: Joi.string().trim(),
                date: Joi.date(),
                startTime: Joi.string(),
                endTime: Joi.string(),
                description: Joi.string(),
            })
        )
        .optional(),
    prerequisites: Joi.array().items(Joi.string()).optional(),
    learningOutcomes: Joi.array().items(Joi.string()).optional(),
    certificateEligibility: Joi.object({
        enabled: Joi.boolean(),
        criteria: Joi.object({
            minAttendance: Joi.number().min(0).max(100),
            minAssignmentScore: Joi.number().min(0).max(100),
            minTestScore: Joi.number().min(0).max(100),
        }),
    }).optional(),
    isPublished: Joi.boolean().optional(),
    isFeatured: Joi.boolean().optional(),
});

module.exports = {
    createCourseSchema,
    updateCourseSchema,
};
