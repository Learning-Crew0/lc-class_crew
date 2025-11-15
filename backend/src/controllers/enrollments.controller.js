const enrollmentService = require("../services/enrollment.service");
const evaluationService = require("../services/evaluation.service");
const {
    successResponse,
    paginatedResponse,
} = require("../utils/response.util");

/**
 * Get all enrollments
 */
const getAllEnrollments = async (req, res, next) => {
    try {
        const { enrollments, pagination } =
            await enrollmentService.getAllEnrollments(req.query);
        return paginatedResponse(
            res,
            enrollments,
            pagination,
            "Enrollments retrieved successfully"
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Get enrollment by ID
 */
const getEnrollmentById = async (req, res, next) => {
    try {
        const enrollment = await enrollmentService.getEnrollmentById(
            req.params.id
        );
        return successResponse(
            res,
            enrollment,
            "Enrollment retrieved successfully"
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Create enrollment
 */
const createEnrollment = async (req, res, next) => {
    try {
        const { courseId } = req.body;
        const enrollment = await enrollmentService.createEnrollment(
            req.user.id,
            courseId
        );
        return successResponse(
            res,
            enrollment,
            "Enrollment created successfully",
            201
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Get user's enrollments
 */
const getUserEnrollments = async (req, res, next) => {
    try {
        const enrollments = await enrollmentService.getUserEnrollments(
            req.user.id
        );
        return successResponse(
            res,
            enrollments,
            "Enrollments retrieved successfully"
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Update enrollment status
 */
const updateStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const enrollment = await enrollmentService.updateEnrollmentStatus(
            req.params.id,
            status
        );
        return successResponse(
            res,
            enrollment,
            "Enrollment status updated successfully"
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Mark attendance
 */
const markAttendance = async (req, res, next) => {
    try {
        const { sessionId, attended } = req.body;
        const enrollment = await enrollmentService.markAttendance(
            req.params.id,
            sessionId,
            attended
        );
        return successResponse(
            res,
            enrollment,
            "Attendance marked successfully"
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Add assessment
 */
const addAssessment = async (req, res, next) => {
    try {
        const enrollment = await enrollmentService.addAssessment(
            req.params.id,
            req.body
        );
        return successResponse(
            res,
            enrollment,
            "Assessment added successfully"
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Check certificate eligibility
 */
const checkEligibility = async (req, res, next) => {
    try {
        const eligibility = await evaluationService.checkCertificateEligibility(
            req.params.id
        );
        return successResponse(
            res,
            eligibility,
            "Eligibility checked successfully"
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Issue certificate
 */
const issueCertificate = async (req, res, next) => {
    try {
        const enrollment = await evaluationService.issueCertificate(
            req.params.id
        );
        return successResponse(
            res,
            enrollment,
            "Certificate issued successfully"
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Get progress report
 */
const getProgress = async (req, res, next) => {
    try {
        const report = await evaluationService.getProgressReport(req.params.id);
        return successResponse(
            res,
            report,
            "Progress report retrieved successfully"
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Delete enrollment
 */
const deleteEnrollment = async (req, res, next) => {
    try {
        const result = await enrollmentService.deleteEnrollment(req.params.id);
        return successResponse(res, result, "Enrollment deleted successfully");
    } catch (error) {
        next(error);
    }
};

/**
 * Get enrolled courses for learning status page
 * GET /api/v1/user/enrolled-courses
 */
const getEnrolledCourses = async (req, res, next) => {
    try {
        const courses =
            await enrollmentService.getEnrolledCoursesForLearningStatus(
                req.user.id
            );
        return successResponse(
            res,
            { courses },
            "수강 중인 강의 목록을 성공적으로 조회했습니다"
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllEnrollments,
    getEnrollmentById,
    createEnrollment,
    getUserEnrollments,
    updateStatus,
    markAttendance,
    addAssessment,
    checkEligibility,
    issueCertificate,
    getProgress,
    deleteEnrollment,
    getEnrolledCourses,
};
