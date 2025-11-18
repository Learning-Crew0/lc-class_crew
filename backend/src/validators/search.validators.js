const Joi = require("joi");

/**
 * Validation schemas for search endpoints
 */

// Validate search query parameters
const searchQuerySchema = Joi.object({
    q: Joi.string().trim().max(100).optional().messages({
        "string.max": "검색어는 100자를 초과할 수 없습니다",
    }),
    search: Joi.string().trim().max(100).optional().messages({
        "string.max": "검색어는 100자를 초과할 수 없습니다",
    }),
    category: Joi.string().trim().optional(),
    minPrice: Joi.number().min(0).optional().messages({
        "number.min": "최소 가격은 0 이상이어야 합니다",
    }),
    maxPrice: Joi.number().min(0).optional().messages({
        "number.min": "최대 가격은 0 이상이어야 합니다",
    }),
    page: Joi.number().integer().min(1).optional().default(1),
    limit: Joi.number().integer().min(1).max(100).optional().default(20),
    isActive: Joi.boolean().optional(),
    sortBy: Joi.string()
        .valid("createdAt", "price", "name", "relevance", "trainingDate")
        .optional()
        .default("relevance"),
    order: Joi.string().valid("asc", "desc").optional().default("desc"),
});

// Validate popular keywords query parameters
const popularKeywordsSchema = Joi.object({
    limit: Joi.number()
        .integer()
        .min(1)
        .max(50)
        .optional()
        .default(10)
        .messages({
            "number.min": "최소 1개 이상의 키워드를 요청해야 합니다",
            "number.max": "최대 50개까지 키워드를 요청할 수 있습니다",
        }),
    period: Joi.string()
        .valid("day", "week", "month", "all")
        .optional()
        .default("week")
        .messages({
            "any.only": "기간은 day, week, month, all 중 하나여야 합니다",
        }),
    minResults: Joi.number().integer().min(0).optional().default(1).messages({
        "number.min": "최소 결과 수는 0 이상이어야 합니다",
    }),
});

// Validate search suggestions query parameters
const suggestionsQuerySchema = Joi.object({
    q: Joi.string().trim().min(1).max(50).required().messages({
        "string.empty": "검색어를 입력해주세요",
        "string.min": "검색어는 최소 1자 이상이어야 합니다",
        "string.max": "검색어는 50자를 초과할 수 없습니다",
        "any.required": "검색어가 필요합니다",
    }),
    limit: Joi.number()
        .integer()
        .min(1)
        .max(20)
        .optional()
        .default(5)
        .messages({
            "number.min": "최소 1개 이상의 제안을 요청해야 합니다",
            "number.max": "최대 20개까지 제안을 요청할 수 있습니다",
        }),
});

// Validate search history query parameters
const searchHistorySchema = Joi.object({
    limit: Joi.number()
        .integer()
        .min(1)
        .max(50)
        .optional()
        .default(10)
        .messages({
            "number.min": "최소 1개 이상의 검색 기록을 요청해야 합니다",
            "number.max": "최대 50개까지 검색 기록을 요청할 수 있습니다",
        }),
});

// Validate log search body
const logSearchSchema = Joi.object({
    keyword: Joi.string().trim().min(1).max(100).required().messages({
        "string.empty": "검색어를 입력해주세요",
        "string.max": "검색어는 100자를 초과할 수 없습니다",
        "any.required": "검색어가 필요합니다",
    }),
    resultsCount: Joi.number().integer().min(0).required().messages({
        "number.min": "결과 수는 0 이상이어야 합니다",
        "any.required": "결과 수가 필요합니다",
    }),
    source: Joi.string()
        .valid("modal", "navbar", "results_page", "autocomplete", "other")
        .optional()
        .default("other"),
    filters: Joi.object({
        category: Joi.string().trim().optional(),
        minPrice: Joi.number().min(0).optional(),
        maxPrice: Joi.number().min(0).optional(),
        isActive: Joi.boolean().optional(),
    }).optional(),
});

module.exports = {
    searchQuerySchema,
    popularKeywordsSchema,
    suggestionsQuerySchema,
    searchHistorySchema,
    logSearchSchema,
};
