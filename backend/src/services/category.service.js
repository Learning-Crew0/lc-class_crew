/**
 * Category & Position Service
 * Handles category and position retrieval
 */

const {
    CATEGORIES,
    POSITIONS,
    getCategoryInfo,
    getPositionInfo,
} = require("../constants/categories");

/**
 * Get all categories
 * @returns {Array} Array of category objects
 */
const getAllCategories = async () => {
    // Return all categories sorted by order
    return CATEGORIES.sort((a, b) => a.order - b.order);
};

/**
 * Get all positions
 * @returns {Array} Array of position objects
 */
const getAllPositions = async () => {
    // Return all positions sorted by order
    return POSITIONS.sort((a, b) => a.order - b.order);
};

/**
 * Get category by slug
 * @param {string} slug - Category slug
 * @returns {Object|null} Category object or null
 */
const getCategoryBySlug = async (slug) => {
    return getCategoryInfo(slug);
};

/**
 * Get position by slug
 * @param {string} slug - Position slug
 * @returns {Object|null} Position object or null
 */
const getPositionBySlug = async (slug) => {
    return getPositionInfo(slug);
};

module.exports = {
    getAllCategories,
    getAllPositions,
    getCategoryBySlug,
    getPositionBySlug,
};
