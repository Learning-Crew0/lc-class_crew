const courseHistoryService = require("../services/courseHistory.service");
const { successResponse } = require("../utils/response.util");

/**
 * Verify user identity and get course history
 * POST /api/v1/course-history/verify
 */
const verifyCourseHistory = async (req, res, next) => {
    try {
        const { phone, email, name, type } = req.body;
        
        const result = await courseHistoryService.verifyCourseHistory({
            phone,
            email,
            name,
            type,
        });

        return successResponse(res, result, "User verified successfully");
    } catch (error) {
        next(error);
    }
};

module.exports = {
    verifyCourseHistory,
};
