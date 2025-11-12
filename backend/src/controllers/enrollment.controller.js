const enrollmentService = require("../services/enrollment.service");
const asyncHandler = require("../utils/asyncHandler.util");
const { successResponse } = require("../utils/response.util");

const enrollInSchedule = asyncHandler(async (req, res) => {
    const enrollment = await enrollmentService.enrollUserInSchedule(
        req.user.id,
        req.params.courseId,
        req.params.scheduleId,
        req.body
    );
    return successResponse(res, enrollment, "수강 신청이 성공적으로 완료되었습니다", 201);
});

const getMyEnrollments = asyncHandler(async (req, res) => {
    const result = await enrollmentService.getUserEnrollments(req.user.id, req.query);
    return successResponse(res, result, "내 수강 목록을 성공적으로 조회했습니다");
});

const getEnrollmentById = asyncHandler(async (req, res) => {
    const enrollment = await enrollmentService.getEnrollmentById(req.params.id);
    return successResponse(res, enrollment, "수강 정보를 성공적으로 조회했습니다");
});

const updateEnrollmentStatus = asyncHandler(async (req, res) => {
    const enrollment = await enrollmentService.updateEnrollmentStatus(
        req.params.id,
        req.body.status
    );
    return successResponse(res, enrollment, "수강 상태가 성공적으로 업데이트되었습니다");
});

const updateEnrollmentProgress = asyncHandler(async (req, res) => {
    const enrollment = await enrollmentService.updateEnrollmentProgress(
        req.params.id,
        req.body.progress
    );
    return successResponse(res, enrollment, "진도율이 성공적으로 업데이트되었습니다");
});

const requestRefund = asyncHandler(async (req, res) => {
    const enrollment = await enrollmentService.requestRefund(req.params.id, req.body);
    return successResponse(res, enrollment, "환불 요청이 성공적으로 접수되었습니다");
});

const processRefund = asyncHandler(async (req, res) => {
    const enrollment = await enrollmentService.processRefund(req.params.id, req.body.refundStatus);
    return successResponse(res, enrollment, "환불 처리가 성공적으로 완료되었습니다");
});

const cancelEnrollment = asyncHandler(async (req, res) => {
    const enrollment = await enrollmentService.cancelEnrollment(req.params.id);
    return successResponse(res, enrollment, "수강 취소가 성공적으로 완료되었습니다");
});

/**
 * Get authenticated user's enrollment history
 * GET /api/v1/enrollments/my-history
 */
const getMyEnrollmentHistory = asyncHandler(async (req, res) => {
    const result = await enrollmentService.getMyEnrollmentHistory(
        req.user.id,
        req.query
    );
    return successResponse(res, result.enrollments, "Course history retrieved successfully");
});

/**
 * Download certificate
 * GET /api/v1/enrollments/:enrollmentId/certificate
 */
const downloadCertificate = asyncHandler(async (req, res) => {
    const certificateInfo = await enrollmentService.getCertificateInfo(
        req.params.enrollmentId,
        req.user.id
    );

    // For now, redirect to certificate URL
    // In production, you might want to stream the PDF file
    if (certificateInfo.certificateUrl.startsWith("http")) {
        return res.redirect(certificateInfo.certificateUrl);
    } else {
        // Assume it's a local file path
        const path = require("path");
        const { BASE_UPLOAD_PATH } = require("../config/fileStorage");
        const filePath = path.join(
            BASE_UPLOAD_PATH,
            certificateInfo.certificateUrl.replace("/uploads/", "")
        );
        return res.download(filePath, `certificate-${req.params.enrollmentId}.pdf`);
    }
});

module.exports = {
    enrollInSchedule,
    getMyEnrollments,
    getEnrollmentById,
    updateEnrollmentStatus,
    updateEnrollmentProgress,
    requestRefund,
    processRefund,
    cancelEnrollment,
    getMyEnrollmentHistory,
    downloadCertificate,
};

