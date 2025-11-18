const searchService = require("../services/search.service");
const { successResponse } = require("../utils/response.util");
const ApiError = require("../utils/apiError.util");

/**
 * Search Controller
 * Handles search-related API endpoints
 */

/**
 * Get popular/trending keywords
 * GET /api/v1/search/popular-keywords
 */
const getPopularKeywords = async (req, res, next) => {
    try {
        const { limit, period, minResults } = req.query;

        const keywords = await searchService.getPopularKeywords({
            limit: parseInt(limit) || 10,
            period: period || "week",
            minResults: parseInt(minResults) || 1,
        });

        return successResponse(
            res,
            { keywords },
            "인기 검색어를 성공적으로 조회했습니다"
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Get search suggestions/autocomplete
 * GET /api/v1/search/suggestions
 */
const getSearchSuggestions = async (req, res, next) => {
    try {
        const { q, limit } = req.query;

        if (!q || q.trim().length === 0) {
            throw ApiError.badRequest("검색어를 입력해주세요");
        }

        const suggestions = await searchService.getSearchSuggestions(
            q,
            parseInt(limit) || 5
        );

        return successResponse(
            res,
            { suggestions },
            "검색 제안을 성공적으로 조회했습니다"
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Log a search query
 * POST /api/v1/search/log
 */
const logSearch = async (req, res, next) => {
    try {
        const { keyword, resultsCount, source, filters } = req.body;

        await searchService.logSearch(
            {
                keyword,
                resultsCount,
                source,
                filters,
            },
            req.user,
            req
        );

        return successResponse(res, null, "검색 기록이 저장되었습니다");
    } catch (error) {
        next(error);
    }
};

/**
 * Get user's search history
 * GET /api/v1/search/history
 */
const getUserSearchHistory = async (req, res, next) => {
    try {
        const { limit } = req.query;
        const userId = req.user._id;

        const history = await searchService.getUserSearchHistory(
            userId,
            parseInt(limit) || 10
        );

        return successResponse(
            res,
            { history },
            "검색 기록을 성공적으로 조회했습니다"
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Get search analytics (Admin only)
 * GET /api/v1/search/analytics
 */
const getSearchAnalytics = async (req, res, next) => {
    try {
        const { period } = req.query;

        const analytics = await searchService.getSearchAnalytics(
            period || "week"
        );

        return successResponse(
            res,
            { analytics },
            "검색 분석 데이터를 성공적으로 조회했습니다"
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Clean old search logs (Admin only)
 * DELETE /api/v1/search/logs/cleanup
 */
const cleanOldLogs = async (req, res, next) => {
    try {
        const { daysToKeep } = req.query;

        const result = await searchService.cleanOldSearchLogs(
            parseInt(daysToKeep) || 90
        );

        return successResponse(
            res,
            result,
            `${result.deletedCount}개의 오래된 검색 기록이 삭제되었습니다`
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getPopularKeywords,
    getSearchSuggestions,
    logSearch,
    getUserSearchHistory,
    getSearchAnalytics,
    cleanOldLogs,
};

