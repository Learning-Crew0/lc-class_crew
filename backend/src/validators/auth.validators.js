const Joi = require("joi");
const { MEMBERSHIP_TYPES, GENDER_TYPES } = require("../constants/memberships");

const registerSchema = Joi.object({
    email: Joi.string().email().max(254).required().messages({
        "string.email": "올바른 이메일 형식을 입력해주세요",
        "any.required": "이메일을 입력해주세요",
    }),
    username: Joi.string().trim().min(3).max(50).required().messages({
        "string.min": "사용자 ID는 3자 이상이어야 합니다",
        "string.max": "사용자 ID는 50자를 초과할 수 없습니다",
        "any.required": "사용자 ID를 입력해주세요",
    }),
    password: Joi.string().min(8).max(128).required().messages({
        "string.min": "비밀번호는 8자 이상이어야 합니다",
        "any.required": "비밀번호를 입력해주세요",
    }),
    fullName: Joi.string().trim().min(2).max(100).required().messages({
        "string.min": "성명은 2자 이상이어야 합니다",
        "any.required": "성명을 입력해주세요",
    }),
    gender: Joi.string()
        .valid(...Object.values(GENDER_TYPES))
        .required()
        .messages({
            "any.only": "성별을 선택해주세요",
            "any.required": "성별을 선택해주세요",
        }),
    phone: Joi.string()
        .trim()
        .pattern(/^01[0-9]{9}$/)
        .required()
        .messages({
            "string.pattern.base":
                "올바른 휴대전화 번호를 입력해주세요 (11자리 숫자)",
            "any.required": "휴대전화 번호를 입력해주세요",
        }),
    dob: Joi.date().max("now").required().messages({
        "date.max": "생년월일은 오늘 이전이어야 합니다",
        "any.required": "생년월일을 입력해주세요",
    }),
    memberType: Joi.string()
        .valid(
            MEMBERSHIP_TYPES.EMPLOYED,
            MEMBERSHIP_TYPES.CORPORATE_TRAINING_MANAGER,
            MEMBERSHIP_TYPES.JOB_SEEKER
        )
        .required()
        .messages({
            "any.only": "회원구분을 선택해주세요",
            "any.required": "회원구분을 선택해주세요",
        }),
    agreements: Joi.object({
        termsOfService: Joi.boolean().valid(true).required().messages({
            "any.only": "이용약관에 동의해주세요",
            "any.required": "이용약관에 동의해주세요",
        }),
        privacyPolicy: Joi.boolean().valid(true).required().messages({
            "any.only": "개인정보 수집 및 이용에 동의해주세요",
            "any.required": "개인정보 수집 및 이용에 동의해주세요",
        }),
        marketingConsent: Joi.boolean().optional(),
    }).required(),
});

const loginSchema = Joi.object({
    emailOrUsername: Joi.string().trim().required().messages({
        "any.required": "사용자 ID 또는 이메일 주소를 입력해주세요",
    }),
    password: Joi.string().required().messages({
        "any.required": "비밀번호를 입력해주세요",
    }),
});

const adminLoginSchema = Joi.object({
    email: Joi.string().email().optional(),
    username: Joi.string().trim().optional(),
    password: Joi.string().required().messages({
        "any.required": "비밀번호를 입력해주세요",
    }),
})
    .xor("email", "username")
    .messages({
        "object.xor": "이메일 또는 사용자명 중 하나를 입력해주세요",
    });

const updateProfileSchema = Joi.object({
    fullName: Joi.string().trim().min(2).max(100).optional(),
    phone: Joi.string()
        .trim()
        .pattern(/^01[0-9]{9}$/)
        .optional()
        .messages({
            "string.pattern.base": "올바른 휴대전화 번호를 입력해주세요",
        }),
    profilePicture: Joi.string().uri().optional(),
});

const changePasswordSchema = Joi.object({
    currentPassword: Joi.string().required().messages({
        "any.required": "현재 비밀번호를 입력해주세요",
    }),
    newPassword: Joi.string().min(8).max(128).required().messages({
        "string.min": "새 비밀번호는 8자 이상이어야 합니다",
        "any.required": "새 비밀번호를 입력해주세요",
    }),
});

module.exports = {
    registerSchema,
    loginSchema,
    adminLoginSchema,
    updateProfileSchema,
    changePasswordSchema,
};
