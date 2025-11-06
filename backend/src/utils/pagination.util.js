/**
 * Get pagination parameters from query
 */
const getPaginationParams = (query) => {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    return { page, limit, skip };
};

/**
 * Create pagination metadata
 */
const createPaginationMeta = (page, limit, total) => {
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage,
        hasPrevPage,
    };
};

module.exports = {
    getPaginationParams,
    createPaginationMeta,
};
