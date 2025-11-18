const SearchLog = require("../models/searchLog.model");
const Product = require("../models/product.model");
const Course = require("../models/course.model");
const ApiError = require("../utils/apiError.util");

/**
 * Search Service
 * Handles search logging, popular keywords, and search suggestions
 */

/**
 * Log a search query
 */
const logSearch = async (searchData, user = null, req = null) => {
    try {
        const logEntry = {
            keyword: searchData.keyword.toLowerCase().trim(),
            originalKeyword: searchData.keyword.trim(),
            resultsCount: searchData.resultsCount || 0,
            source: searchData.source || "other",
            filters: searchData.filters || {},
        };

        // Add user info if available
        if (user) {
            logEntry.user = user._id || user;
        }

        // Add request metadata if available
        if (req) {
            logEntry.ipAddress = req.ip || req.connection?.remoteAddress;
            logEntry.userAgent = req.get("user-agent");
            logEntry.sessionId = req.sessionID || req.session?.id;
        }

        await SearchLog.create(logEntry);
    } catch (error) {
        // Don't throw error - logging should not break the main flow
        console.error("Error logging search:", error.message);
    }
};

/**
 * Get popular/trending keywords
 */
const getPopularKeywords = async (options = {}) => {
    const { limit = 10, period = "week", minResults = 1 } = options;

    // Calculate date range based on period
    const now = new Date();
    let startDate = new Date(0); // Beginning of time

    switch (period) {
        case "day":
            startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            break;
        case "week":
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
        case "month":
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
        case "all":
        default:
            startDate = new Date(0);
            break;
    }

    // Aggregate popular keywords
    const keywords = await SearchLog.aggregate([
        // Filter by date range and minimum results
        {
            $match: {
                createdAt: { $gte: startDate },
                resultsCount: { $gte: minResults },
            },
        },
        // Group by keyword
        {
            $group: {
                _id: "$keyword",
                searchCount: { $sum: 1 },
                totalResults: { $sum: "$resultsCount" },
                avgResults: { $avg: "$resultsCount" },
                lastSearched: { $max: "$createdAt" },
                originalKeyword: { $first: "$originalKeyword" },
            },
        },
        // Sort by search count (most popular first)
        {
            $sort: { searchCount: -1, lastSearched: -1 },
        },
        // Limit results
        {
            $limit: limit,
        },
        // Format output
        {
            $project: {
                _id: 0,
                keyword: "$originalKeyword",
                searchCount: 1,
                avgResults: { $round: ["$avgResults", 0] },
                lastSearched: 1,
            },
        },
    ]);

    return keywords;
};

/**
 * Get search suggestions based on partial query
 */
const getSearchSuggestions = async (query, limit = 5) => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery || trimmedQuery.length < 1) {
        return [];
    }

    // Create case-insensitive regex for partial matching
    const regex = new RegExp(trimmedQuery, "i");

    try {
        // Get suggestions from recent successful searches
        const recentSearches = await SearchLog.aggregate([
            {
                $match: {
                    originalKeyword: { $regex: regex },
                    resultsCount: { $gt: 0 },
                    createdAt: {
                        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                    }, // Last 30 days
                },
            },
            {
                $group: {
                    _id: "$keyword",
                    count: { $sum: 1 },
                    originalKeyword: { $first: "$originalKeyword" },
                },
            },
            {
                $sort: { count: -1 },
            },
            {
                $limit: limit,
            },
        ]);

        const suggestions = recentSearches.map((s) => s.originalKeyword);

        // If not enough suggestions, get from product/course names
        if (suggestions.length < limit) {
            const remaining = limit - suggestions.length;

            // Search in products
            const products = await Product.find(
                {
                    $or: [
                        { name: { $regex: regex } },
                        { description: { $regex: regex } },
                    ],
                    isActive: true,
                },
                { name: 1 }
            ).limit(remaining);

            // Add product names that aren't already in suggestions
            products.forEach((product) => {
                if (
                    product.name &&
                    !suggestions.some(
                        (s) => s.toLowerCase() === product.name.toLowerCase()
                    )
                ) {
                    suggestions.push(product.name);
                }
            });
        }

        return suggestions.slice(0, limit);
    } catch (error) {
        console.error("Error getting search suggestions:", error.message);
        return [];
    }
};

/**
 * Get user's search history
 */
const getUserSearchHistory = async (userId, limit = 10) => {
    const history = await SearchLog.find({ user: userId })
        .select("originalKeyword resultsCount createdAt source")
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

    return history.map((h) => ({
        keyword: h.originalKeyword,
        resultsCount: h.resultsCount,
        searchedAt: h.createdAt,
        source: h.source,
    }));
};

/**
 * Get search analytics/statistics
 */
const getSearchAnalytics = async (period = "week") => {
    const now = new Date();
    let startDate = new Date(0);

    switch (period) {
        case "day":
            startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            break;
        case "week":
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
        case "month":
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
        default:
            startDate = new Date(0);
    }

    const analytics = await SearchLog.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate },
            },
        },
        {
            $group: {
                _id: null,
                totalSearches: { $sum: 1 },
                uniqueKeywords: { $addToSet: "$keyword" },
                avgResultsPerSearch: { $avg: "$resultsCount" },
                searchesWithResults: {
                    $sum: { $cond: [{ $gt: ["$resultsCount", 0] }, 1, 0] },
                },
                searchesWithNoResults: {
                    $sum: { $cond: [{ $eq: ["$resultsCount", 0] }, 1, 0] },
                },
            },
        },
        {
            $project: {
                _id: 0,
                totalSearches: 1,
                uniqueKeywords: { $size: "$uniqueKeywords" },
                avgResultsPerSearch: { $round: ["$avgResultsPerSearch", 2] },
                searchesWithResults: 1,
                searchesWithNoResults: 1,
                successRate: {
                    $multiply: [
                        {
                            $divide: ["$searchesWithResults", "$totalSearches"],
                        },
                        100,
                    ],
                },
            },
        },
    ]);

    return (
        analytics[0] || {
            totalSearches: 0,
            uniqueKeywords: 0,
            avgResultsPerSearch: 0,
            searchesWithResults: 0,
            searchesWithNoResults: 0,
            successRate: 0,
        }
    );
};

/**
 * Clean old search logs (older than specified days)
 */
const cleanOldSearchLogs = async (daysToKeep = 90) => {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);

    const result = await SearchLog.deleteMany({
        createdAt: { $lt: cutoffDate },
    });

    return {
        deletedCount: result.deletedCount,
        cutoffDate,
    };
};

module.exports = {
    logSearch,
    getPopularKeywords,
    getSearchSuggestions,
    getUserSearchHistory,
    getSearchAnalytics,
    cleanOldSearchLogs,
};
