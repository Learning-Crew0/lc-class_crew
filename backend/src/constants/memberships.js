const MEMBERSHIP_TYPES = {
    EMPLOYED: "employed",
    CORPORATE_TRAINING_MANAGER: "corporate_training",
    JOB_SEEKER: "job_seeker",
    ADMIN: "admin",
};

// Korean to English mapping for frontend compatibility
const MEMBERSHIP_TYPES_KOREAN_MAP = {
    재직자: "employed",
    기업교육담당자: "corporate_training",
    취업준비생: "job_seeker",
};

// All valid memberType values (English + Korean)
const ALL_MEMBERSHIP_VALUES = [
    MEMBERSHIP_TYPES.EMPLOYED,
    MEMBERSHIP_TYPES.CORPORATE_TRAINING_MANAGER,
    MEMBERSHIP_TYPES.JOB_SEEKER,
    "재직자",
    "기업교육담당자",
    "취업준비생",
];

const USER_ROLES = {
    USER: "user",
    ADMIN: "admin",
};

const GENDER_TYPES = {
    MALE: "male",
    FEMALE: "female",
};

module.exports = {
    MEMBERSHIP_TYPES,
    MEMBERSHIP_TYPES_KOREAN_MAP,
    ALL_MEMBERSHIP_VALUES,
    USER_ROLES,
    GENDER_TYPES,
};
