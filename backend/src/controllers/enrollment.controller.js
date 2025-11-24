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
    return successResponse(
        res,
        enrollment,
        "수강 신청이 성공적으로 완료되었습니다",
        201
    );
});

const getMyEnrollments = asyncHandler(async (req, res) => {
    const result = await enrollmentService.getUserEnrollments(
        req.user.id,
        req.query
    );
    return successResponse(
        res,
        result,
        "내 수강 목록을 성공적으로 조회했습니다"
    );
});

const getEnrollmentById = asyncHandler(async (req, res) => {
    const enrollment = await enrollmentService.getEnrollmentById(req.params.id);
    return successResponse(
        res,
        enrollment,
        "수강 정보를 성공적으로 조회했습니다"
    );
});

const updateEnrollmentStatus = asyncHandler(async (req, res) => {
    const enrollment = await enrollmentService.updateEnrollmentStatus(
        req.params.id,
        req.body.status
    );
    return successResponse(
        res,
        enrollment,
        "수강 상태가 성공적으로 업데이트되었습니다"
    );
});

const updateEnrollmentProgress = asyncHandler(async (req, res) => {
    const enrollment = await enrollmentService.updateEnrollmentProgress(
        req.params.id,
        req.body.progress
    );
    return successResponse(
        res,
        enrollment,
        "진도율이 성공적으로 업데이트되었습니다"
    );
});

const requestRefund = asyncHandler(async (req, res) => {
    const enrollment = await enrollmentService.requestRefund(
        req.params.id,
        req.body
    );
    return successResponse(
        res,
        enrollment,
        "환불 요청이 성공적으로 접수되었습니다"
    );
});

const processRefund = asyncHandler(async (req, res) => {
    const enrollment = await enrollmentService.processRefund(
        req.params.id,
        req.body.refundStatus
    );
    return successResponse(
        res,
        enrollment,
        "환불 처리가 성공적으로 완료되었습니다"
    );
});

const cancelEnrollment = asyncHandler(async (req, res) => {
    const enrollment = await enrollmentService.cancelEnrollment(req.params.id);
    return successResponse(
        res,
        enrollment,
        "수강 취소가 성공적으로 완료되었습니다"
    );
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
    return successResponse(
        res,
        result.enrollments,
        "Course history retrieved successfully"
    );
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
        // Extract path from full URL or redirect to external URL
        try {
            const url = new URL(certificateInfo.certificateUrl);
            // If it's a local file served by this server, download it
            const config = require("../config/env");
            const serverUrlObj = new URL(config.serverUrl);

            if (url.host === serverUrlObj.host) {
                // It's a local file
                const path = require("path");
                const { BASE_UPLOAD_PATH } = require("../config/fileStorage");
                const filePath = path.join(
                    BASE_UPLOAD_PATH,
                    url.pathname.replace("/uploads/", "")
                );
                return res.download(
                    filePath,
                    `certificate-${req.params.enrollmentId}.pdf`
                );
            } else {
                // External URL, redirect to it
                return res.redirect(certificateInfo.certificateUrl);
            }
        } catch (error) {
            // Invalid URL, redirect anyway
            return res.redirect(certificateInfo.certificateUrl);
        }
    } else {
        // Assume it's a local file path (legacy support)
        const path = require("path");
        const { BASE_UPLOAD_PATH } = require("../config/fileStorage");
        const filePath = path.join(
            BASE_UPLOAD_PATH,
            certificateInfo.certificateUrl.replace("/uploads/", "")
        );
        return res.download(
            filePath,
            `certificate-${req.params.enrollmentId}.pdf`
        );
    }
});

/**
 * Get enrolled courses for learning status page
 * GET /api/v1/user/enrolled-courses
 */
const getEnrolledCourses = asyncHandler(async (req, res) => {
    const courses = await enrollmentService.getEnrolledCoursesForLearningStatus(
        req.user.id
    );
    return successResponse(
        res,
        { courses },
        "수강 중인 강의 목록을 성공적으로 조회했습니다"
    );
});

/**
 * Get all enrollments for admin
 * GET /api/v1/admin/enrollments
 */
const getAllEnrollmentsAdmin = asyncHandler(async (req, res) => {
    const result = await enrollmentService.getAllEnrollmentsAdmin(req.query);
    return successResponse(res, result, "신청 목록을 성공적으로 조회했습니다");
});

/**
 * Mark enrollment as completed (admin)
 * PATCH /api/v1/admin/enrollments/:enrollmentId/complete
 */
const markEnrollmentCompleted = asyncHandler(async (req, res) => {
    const enrollment = await enrollmentService.markEnrollmentCompleted(
        req.params.enrollmentId,
        req.body
    );
    return successResponse(res, { enrollment }, "완료 처리되었습니다");
});

/**
 * Bulk update enrollments (admin)
 * POST /api/v1/admin/enrollments/bulk-update
 */
const bulkUpdateEnrollments = asyncHandler(async (req, res) => {
    const { enrollmentIds, ...updateData } = req.body;
    const result = await enrollmentService.bulkUpdateEnrollments(
        enrollmentIds,
        updateData
    );
    return successResponse(
        res,
        result,
        `${result.updatedCount}명이 완료 처리되었습니다`
    );
});

/**
 * Generate bulk certificates (admin)
 * POST /api/v1/admin/enrollments/bulk-certificates
 */
const generateBulkCertificates = asyncHandler(async (req, res) => {
    const { enrollmentIds } = req.body;

    // TODO: Implement PDF generation for multiple certificates
    // For now, return a placeholder response
    throw new Error(
        "Certificate generation not implemented yet. Please implement PDF generation using pdfkit or similar library."
    );
});

/**
 * Export enrollments to Excel (admin)
 * GET /api/v1/admin/enrollments/export
 */
const exportEnrollmentsToExcel = asyncHandler(async (req, res) => {
    const ExcelJS = require("exceljs");
    const enrollments = await enrollmentService.getEnrollmentsForExport(
        req.query
    );

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("수강신청목록");

    // Define columns
    worksheet.columns = [
        { header: "신청일", key: "createdAt", width: 15 },
        { header: "과정명", key: "courseName", width: 30 },
        { header: "교육기간", key: "trainingPeriod", width: 25 },
        { header: "이름", key: "name", width: 15 },
        { header: "이메일", key: "email", width: 25 },
        { header: "전화번호", key: "phone", width: 15 },
        { header: "회사명", key: "company", width: 20 },
        { header: "부서", key: "department", width: 15 },
        { header: "직급", key: "position", width: 15 },
        { header: "상태", key: "status", width: 12 },
        { header: "결제방법", key: "paymentMethod", width: 15 },
        { header: "결제금액", key: "amount", width: 15 },
        { header: "완료여부", key: "completed", width: 12 },
    ];

    // Style header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE0E0E0" },
    };

    // Add data rows
    enrollments.forEach((enrollment) => {
        const schedule = enrollment.schedule;
        const trainingPeriod = schedule
            ? `${new Date(schedule.startDate).toLocaleDateString("ko-KR")} ~ ${new Date(schedule.endDate).toLocaleDateString("ko-KR")}`
            : "N/A";

        worksheet.addRow({
            createdAt: new Date(enrollment.createdAt).toLocaleDateString(
                "ko-KR"
            ),
            courseName: enrollment.course?.title || "N/A",
            trainingPeriod: trainingPeriod,
            name: enrollment.user?.fullName || "N/A",
            email: enrollment.user?.email || "N/A",
            phone: enrollment.user?.phone || "N/A",
            company: enrollment.user?.company || "N/A",
            department: enrollment.user?.department || "N/A",
            position: enrollment.user?.memberType || "N/A",
            status: enrollment.status || "N/A",
            paymentMethod: enrollment.paymentMethod || "N/A",
            amount: enrollment.amountPaid
                ? `₩${enrollment.amountPaid.toLocaleString()}`
                : "₩0",
            completed: enrollment.status === "수료" ? "완료" : "미완료",
        });
    });

    // Set response headers
    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
        "Content-Disposition",
        `attachment; filename=enrollments-${Date.now()}.xlsx`
    );

    // Write to response
    await workbook.xlsx.write(res);
    res.end();
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
    getEnrolledCourses,
    // Admin functions
    getAllEnrollmentsAdmin,
    markEnrollmentCompleted,
    bulkUpdateEnrollments,
    generateBulkCertificates,
    exportEnrollmentsToExcel,
};
