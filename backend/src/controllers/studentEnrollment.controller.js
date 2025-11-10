const studentEnrollmentService = require("../services/studentEnrollment.service");
const asyncHandler = require("../utils/asyncHandler.util");
const ApiError = require("../utils/apiError.util");
const { successResponse } = require("../utils/response.util");

/**
 * Get student's enrollments
 *
 * @route GET /api/v1/enrollments/student/:userId
 * @access Private
 */
const getStudentEnrollments = asyncHandler(async (req, res) => {
    if (!req.user || !req.user.id) {
        throw ApiError.unauthorized("Authentication required");
    }

    const { userId } = req.params;

    // Verify user is accessing their own enrollments
    if (userId !== req.user.id) {
        throw ApiError.forbidden("You can only access your own enrollments");
    }

    const result = await studentEnrollmentService.getStudentEnrollments(
        userId,
        req.query
    );

    return successResponse(res, result, "Enrollments retrieved successfully");
});

/**
 * Get enrollment by ID
 *
 * @route GET /api/v1/enrollments/:enrollmentId
 * @access Private
 */
const getEnrollmentById = asyncHandler(async (req, res) => {
    if (!req.user || !req.user.id) {
        throw ApiError.unauthorized("Authentication required");
    }

    const { enrollmentId } = req.params;

    const enrollment = await studentEnrollmentService.getEnrollmentById(
        enrollmentId,
        req.user.id
    );

    return successResponse(
        res,
        enrollment,
        "Enrollment retrieved successfully"
    );
});

/**
 * Add attendance record (Admin only)
 *
 * @route POST /api/v1/enrollments/:enrollmentId/attendance
 * @access Private (Admin)
 */
const addAttendanceRecord = asyncHandler(async (req, res) => {
    const { enrollmentId } = req.params;
    const { date, status, notes } = req.body;

    if (!date || !status) {
        throw ApiError.badRequest("Date and status are required");
    }

    const enrollment = await studentEnrollmentService.addAttendanceRecord(
        enrollmentId,
        { date, status, notes }
    );

    return successResponse(res, enrollment, "Attendance recorded successfully");
});

/**
 * Mark enrollment as completed (Admin only)
 *
 * @route POST /api/v1/enrollments/:enrollmentId/complete
 * @access Private (Admin)
 */
const completeEnrollment = asyncHandler(async (req, res) => {
    const { enrollmentId } = req.params;

    const enrollment =
        await studentEnrollmentService.completeEnrollment(enrollmentId);

    return successResponse(res, enrollment, "Enrollment marked as completed");
});

/**
 * Issue certificate (Admin only)
 *
 * @route POST /api/v1/enrollments/:enrollmentId/certificate
 * @access Private (Admin)
 */
const issueCertificate = asyncHandler(async (req, res) => {
    const { enrollmentId } = req.params;
    const { certificateUrl } = req.body;

    if (!certificateUrl) {
        throw ApiError.badRequest("Certificate URL is required");
    }

    const enrollment = await studentEnrollmentService.issueCertificate(
        enrollmentId,
        certificateUrl
    );

    return successResponse(res, enrollment, "Certificate issued successfully");
});

/**
 * Cancel enrollment
 *
 * @route POST /api/v1/enrollments/:enrollmentId/cancel
 * @access Private
 */
const cancelEnrollment = asyncHandler(async (req, res) => {
    if (!req.user || !req.user.id) {
        throw ApiError.unauthorized("Authentication required");
    }

    const { enrollmentId } = req.params;
    const { reason } = req.body;

    if (!reason) {
        throw ApiError.badRequest("Cancellation reason is required");
    }

    const enrollment = await studentEnrollmentService.cancelEnrollment(
        enrollmentId,
        reason
    );

    return successResponse(
        res,
        enrollment,
        "Enrollment cancelled successfully"
    );
});

/**
 * Get enrollment statistics for a course (Admin only)
 *
 * @route GET /api/v1/enrollments/stats/course/:courseId
 * @access Private (Admin)
 */
const getCourseEnrollmentStats = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const { scheduleId } = req.query;

    const stats = await studentEnrollmentService.getCourseEnrollmentStats(
        courseId,
        scheduleId
    );

    return successResponse(
        res,
        stats,
        "Enrollment statistics retrieved successfully"
    );
});

module.exports = {
    getStudentEnrollments,
    getEnrollmentById,
    addAttendanceRecord,
    completeEnrollment,
    issueCertificate,
    cancelEnrollment,
    getCourseEnrollmentStats,
};
