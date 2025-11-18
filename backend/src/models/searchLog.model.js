const mongoose = require("mongoose");

/**
 * SearchLog Schema
 * Tracks all search queries for analytics and popular keywords
 */
const searchLogSchema = new mongoose.Schema(
    {
        // Search keyword/query
        keyword: {
            type: String,
            required: [true, "Search keyword is required"],
            trim: true,
            lowercase: true, // Store in lowercase for consistency
            maxlength: [100, "Search keyword cannot exceed 100 characters"],
        },

        // Original keyword (preserves case)
        originalKeyword: {
            type: String,
            required: true,
            trim: true,
        },

        // User who performed the search (optional - can be anonymous)
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        // Number of results returned
        resultsCount: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },

        // Source of the search
        source: {
            type: String,
            enum: ["modal", "navbar", "results_page", "autocomplete", "other"],
            default: "other",
        },

        // Additional filters applied (optional)
        filters: {
            category: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Category",
            },
            minPrice: Number,
            maxPrice: Number,
            isActive: Boolean,
        },

        // Session ID for anonymous users
        sessionId: {
            type: String,
            trim: true,
        },

        // IP address (for rate limiting and analytics)
        ipAddress: {
            type: String,
            trim: true,
        },

        // User agent
        userAgent: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for performance
searchLogSchema.index({ keyword: 1, createdAt: -1 });
searchLogSchema.index({ user: 1, createdAt: -1 });
searchLogSchema.index({ createdAt: -1 });
searchLogSchema.index({ keyword: 1, resultsCount: 1 });

// Compound index for popular keywords analysis
searchLogSchema.index({ keyword: 1, createdAt: -1, resultsCount: 1 });

// TTL index - auto-delete logs older than 90 days
searchLogSchema.index(
    { createdAt: 1 },
    { expireAfterSeconds: 90 * 24 * 60 * 60 }
);

module.exports = mongoose.model("SearchLog", searchLogSchema);
