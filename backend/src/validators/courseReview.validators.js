const Joi = require("joi");

const createCourseReviewSchema = Joi.object({
    reviewerName: Joi.string().trim().min(2).max(100).required().messages({
        "string.empty": "리뷰어 이름을 입력해주세요",
        "any.required": "리뷰어 이름은 필수입니다",
    }),
    text: Joi.string().trim().min(10).max(1000).required().messages({
        "string.empty": "리뷰 내용을 입력해주세요",
        "string.min": "리뷰는 최소 10자 이상 작성해주세요",
        "string.max": "리뷰는 최대 1000자까지 작성 가능합니다",
        "any.required": "리뷰 내용은 필수입니다",
    }),
    rating: Joi.number().integer().min(1).max(5).optional().messages({
        "number.min": "평점은 1-5 사이여야 합니다",
        "number.max": "평점은 1-5 사이여야 합니다",
    }),
});

const updateCourseReviewSchema = Joi.object({
    text: Joi.string().trim().min(10).max(1000).optional(),
    rating: Joi.number().integer().min(1).max(5).optional(),
    isApproved: Joi.boolean().optional(),
});

module.exports = {
    createCourseReviewSchema,
    updateCourseReviewSchema,
};

