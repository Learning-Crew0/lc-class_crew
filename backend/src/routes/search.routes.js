const express = require("express");
const router = express.Router();
const searchController = require("../controllers/search.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validate.middleware");
const {
    popularKeywordsSchema,
    suggestionsQuerySchema,
    logSearchSchema,
    searchHistorySchema,
} = require("../validators/search.validators");

/**
 * Search Routes
 * Base path: /api/v1/search
 */

// Public endpoints (no authentication required)

/**
 * @route   GET /api/v1/search/popular-keywords
 * @desc    Get popular/trending keywords
 * @access  Public
 */
router.get(
    "/popular-keywords",
    validate(popularKeywordsSchema),
    searchController.getPopularKeywords
);

/**
 * @route   GET /api/v1/search/suggestions
 * @desc    Get search suggestions/autocomplete
 * @access  Public
 */
router.get(
    "/suggestions",
    validate(suggestionsQuerySchema),
    searchController.getSearchSuggestions
);

// Protected endpoints (authentication required)

/**
 * @route   POST /api/v1/search/log
 * @desc    Log a search query
 * @access  Public (but logs user if authenticated)
 * @note    This endpoint is optional - can be called with or without auth
 */
router.post(
    "/log",
    (req, res, next) => {
        // Try to authenticate, but don't fail if not authenticated
        if (req.headers.authorization) {
            authenticate(req, res, (err) => {
                // Continue regardless of authentication status
                next();
            });
        } else {
            // No token, continue as anonymous
            next();
        }
    },
    validate(logSearchSchema),
    searchController.logSearch
);

/**
 * @route   GET /api/v1/search/history
 * @desc    Get user's search history
 * @access  Private (User)
 */
router.get(
    "/history",
    authenticate,
    validate(searchHistorySchema),
    searchController.getUserSearchHistory
);

// Admin-only endpoints

/**
 * @route   GET /api/v1/search/analytics
 * @desc    Get search analytics and statistics
 * @access  Private (Admin)
 */
router.get("/analytics", authenticate, searchController.getSearchAnalytics);

/**
 * @route   DELETE /api/v1/search/logs/cleanup
 * @desc    Clean old search logs
 * @access  Private (Admin)
 */
router.delete("/logs/cleanup", authenticate, searchController.cleanOldLogs);

module.exports = router;
