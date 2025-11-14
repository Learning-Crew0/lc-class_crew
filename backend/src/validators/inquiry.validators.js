const Joi = require("joi");

const createInquirySchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required().messages({
        "string.empty": "Name is required",
        "string.min": "Name must be at least 2 characters",
        "string.max": "Name cannot exceed 100 characters",
        "any.required": "Name is required",
    }),
    email: Joi.string().email().required().messages({
        "string.email": "Please provide a valid email",
        "any.required": "Email is required",
    }),
    phone: Joi.string()
        .pattern(
            /^01[0-9]{9,10}$|^[6-9][0-9]{9}$|^91[6-9][0-9]{9}$|^82[0-9]{9,10}$|^\+?[0-9]{10,15}$/
        )
        .required()
        .messages({
            "string.pattern.base": "Phone must be valid format",
            "any.required": "Phone is required",
        }),
    company: Joi.string().trim().max(200).optional().allow(""),
    countryCode: Joi.string().optional().default("82"),
    category: Joi.string()
        .valid(
            "General Question",
            "Technical Support",
            "Program Inquiry",
            "Payment Issue",
            "Partnership",
            "Other"
        )
        .required()
        .messages({
            "any.only":
                "Category must be one of: General Question, Technical Support, Program Inquiry, Payment Issue, Partnership, Other",
            "any.required": "Category is required",
        }),
    subject: Joi.string().trim().max(200).required().messages({
        "string.empty": "Subject is required",
        "string.max": "Subject cannot exceed 200 characters",
        "any.required": "Subject is required",
    }),
    message: Joi.string().min(10).max(2000).required().messages({
        "string.min": "Message must be at least 10 characters",
        "string.max": "Message cannot exceed 2000 characters",
        "any.required": "Message is required",
    }),
    attachmentUrl: Joi.string().uri().optional().allow(""),
    attachmentOriginalName: Joi.string().optional().allow(""),
    agreeToTerms: Joi.boolean().valid(true).required().messages({
        "any.only": "You must agree to the terms",
        "any.required": "Agreement to terms is required",
    }),
});

const updateStatusSchema = Joi.object({
    status: Joi.string()
        .valid("pending", "in_progress", "resolved", "closed")
        .required(),
});

const assignInquirySchema = Joi.object({
    adminId: Joi.string().hex().length(24).required(),
});

const respondSchema = Joi.object({
    message: Joi.string().required(),
    attachments: Joi.array().items(Joi.string().uri()).optional().default([]),
});

const addNoteSchema = Joi.object({
    content: Joi.string().required(),
});

const updateInquirySchema = Joi.object({
    priority: Joi.string().valid("low", "medium", "high", "urgent").optional(),
    status: Joi.string()
        .valid("pending", "in_progress", "resolved", "closed")
        .optional(),
});

// Personal Inquiry Schema
const personalInquirySchema = Joi.object({
    phone: Joi.object({
        prefix: Joi.string()
            .valid("010", "011", "016", "017", "018", "019")
            .required()
            .messages({
                "any.required": "전화번호 앞자리를 선택해주세요",
                "any.only": "올바른 전화번호 앞자리를 선택해주세요",
            }),
        middle: Joi.string()
            .pattern(/^[0-9]{3,4}$/)
            .required()
            .messages({
                "string.pattern.base":
                    "전화번호 중간자리는 3-4자리 숫자여야 합니다",
                "any.required": "전화번호 중간자리를 입력해주세요",
            }),
        last: Joi.string()
            .pattern(/^[0-9]{4}$/)
            .required()
            .messages({
                "string.pattern.base":
                    "전화번호 뒷자리는 4자리 숫자여야 합니다",
                "any.required": "전화번호 뒷자리를 입력해주세요",
            }),
    })
        .required()
        .messages({
            "any.required": "휴대전화번호를 입력해주세요",
        }),
    email: Joi.object({
        username: Joi.string().trim().required().messages({
            "string.empty": "이메일 아이디를 입력해주세요",
            "any.required": "이메일 아이디를 입력해주세요",
        }),
        domain: Joi.string().trim().required().messages({
            "string.empty": "이메일 도메인을 선택해주세요",
            "any.required": "이메일 도메인을 선택해주세요",
        }),
    })
        .required()
        .messages({
            "any.required": "이메일을 입력해주세요",
        }),
    name: Joi.string().trim().min(2).max(100).required().messages({
        "string.empty": "이름을 입력해주세요",
        "string.min": "이름은 최소 2자 이상이어야 합니다",
        "string.max": "이름은 최대 100자까지 입력 가능합니다",
        "any.required": "이름을 입력해주세요",
    }),
});

// Corporate Inquiry Schema - Same fields as personal (phone, email, name only)
const corporateInquirySchema = Joi.object({
    phone: Joi.object({
        prefix: Joi.string()
            .valid("010", "011", "016", "017", "018", "019")
            .required()
            .messages({
                "any.required": "전화번호 앞자리를 선택해주세요",
                "any.only": "올바른 전화번호 앞자리를 선택해주세요",
            }),
        middle: Joi.string()
            .pattern(/^[0-9]{3,4}$/)
            .required()
            .messages({
                "string.pattern.base":
                    "전화번호 중간자리는 3-4자리 숫자여야 합니다",
                "any.required": "전화번호 중간자리를 입력해주세요",
            }),
        last: Joi.string()
            .pattern(/^[0-9]{4}$/)
            .required()
            .messages({
                "string.pattern.base":
                    "전화번호 뒷자리는 4자리 숫자여야 합니다",
                "any.required": "전화번호 뒷자리를 입력해주세요",
            }),
    })
        .required()
        .messages({
            "any.required": "휴대전화번호를 입력해주세요",
        }),
    email: Joi.object({
        username: Joi.string().trim().required().messages({
            "string.empty": "이메일 아이디를 입력해주세요",
            "any.required": "이메일 아이디를 입력해주세요",
        }),
        domain: Joi.string().trim().required().messages({
            "string.empty": "이메일 도메인을 선택해주세요",
            "any.required": "이메일 도메인을 선택해주세요",
        }),
    })
        .required()
        .messages({
            "any.required": "이메일을 입력해주세요",
        }),
    name: Joi.string().trim().min(2).max(100).required().messages({
        "string.empty": "이름을 입력해주세요",
        "string.min": "이름은 최소 2자 이상이어야 합니다",
        "string.max": "이름은 최대 100자까지 입력 가능합니다",
        "any.required": "이름을 입력해주세요",
    }),
});

module.exports = {
    createInquirySchema,
    updateStatusSchema,
    assignInquirySchema,
    respondSchema,
    addNoteSchema,
    updateInquirySchema,
    personalInquirySchema,
    corporateInquirySchema,
};
