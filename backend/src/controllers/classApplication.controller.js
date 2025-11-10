const classApplicationService = require("../services/classApplication.service");
const studentValidationService = require("../services/studentValidation.service");
const asyncHandler = require("../utils/asyncHandler.util");
const ApiError = require("../utils/apiError.util");
const { successResponse } = require("../utils/response.util");

/**
 * Create draft application from selected courses
 * 
 * @route POST /api/v1/class-applications/draft
 * @access Private
 */
const createDraftApplication = asyncHandler(async (req, res) => {
    if (!req.user || !req.user.id) {
        throw ApiError.unauthorized("Authentication required");
    }

    const { courseIds } = req.body;

    if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
        throw ApiError.badRequest("At least one course ID is required");
    }

    const application = await classApplicationService.createDraftApplication(
        req.user.id,
        courseIds
    );

    return successResponse(
        res,
        application,
        "Draft application created successfully",
        201
    );
});

/**
 * Validate student credentials
 * 
 * @route POST /api/v1/class-applications/validate-student
 * @access Private
 */
const validateStudent = asyncHandler(async (req, res) => {
    const { email, phone, name } = req.body;

    if (!email || !phone || !name) {
        throw ApiError.badRequest("Email, phone, and name are required");
    }

    // Parse email string if provided as string
    let emailObj = email;
    if (typeof email === "string") {
        const [username, domain] = email.split("@");
        emailObj = { username, domain };
    }

    // Parse phone string if provided as string
    let phoneObj = phone;
    if (typeof phone === "string") {
        const digits = phone.replace(/\D/g, "");
        phoneObj = {
            prefix: digits.substring(0, 3),
            middle: digits.substring(3, 7),
            last: digits.substring(7, 11),
        };
    }

    const validation = await studentValidationService.validateStudent({
        email: emailObj,
        phone: phoneObj,
        name,
    });

    if (!validation.valid) {
        return successResponse(
            res,
            {
                exists: false,
                message: validation.error,
            },
            validation.error,
            400
        );
    }

    return successResponse(
        res,
        {
            userId: validation.userId,
            exists: true,
            user: validation.user,
        },
        "Student validated successfully"
    );
});

/**
 * Add student to a course in application
 * 
 * @route POST /api/v1/class-applications/:applicationId/add-student
 * @access Private
 */
const addStudentToCourse = asyncHandler(async (req, res) => {
    if (!req.user || !req.user.id) {
        throw ApiError.unauthorized("Authentication required");
    }

    const { applicationId } = req.params;
    const { courseId, studentData } = req.body;

    if (!courseId) {
        throw ApiError.badRequest("Course ID is required");
    }

    if (!studentData) {
        throw ApiError.badRequest("Student data is required");
    }

    const application = await classApplicationService.addStudentToCourse(
        applicationId,
        courseId,
        studentData
    );

    return successResponse(res, application, "Student added successfully");
});

/**
 * Upload bulk students file
 * 
 * @route POST /api/v1/class-applications/:applicationId/upload-bulk-students
 * @access Private
 */
const uploadBulkStudents = asyncHandler(async (req, res) => {
    if (!req.user || !req.user.id) {
        throw ApiError.unauthorized("Authentication required");
    }

    if (!req.file) {
        throw ApiError.badRequest("Excel file is required");
    }

    const { applicationId } = req.params;
    const { courseId } = req.body;

    if (!courseId) {
        throw ApiError.badRequest("Course ID is required");
    }

    const result = await classApplicationService.uploadBulkStudents(
        applicationId,
        courseId,
        req.file
    );

    return successResponse(res, result, "Bulk upload processed successfully");
});

/**
 * Update payment information
 * 
 * @route PUT /api/v1/class-applications/:applicationId/payment
 * @access Private
 */
const updatePaymentInfo = asyncHandler(async (req, res) => {
    if (!req.user || !req.user.id) {
        throw ApiError.unauthorized("Authentication required");
    }

    const { applicationId } = req.params;

    const application = await classApplicationService.updatePaymentInfo(
        applicationId,
        req.body
    );

    return successResponse(res, application, "Payment information updated successfully");
});

/**
 * Submit application
 * 
 * @route POST /api/v1/class-applications/:applicationId/submit
 * @access Private
 */
const submitApplication = asyncHandler(async (req, res) => {
    if (!req.user || !req.user.id) {
        throw ApiError.unauthorized("Authentication required");
    }

    const { applicationId } = req.params;
    const { agreements } = req.body;

    if (!agreements) {
        throw ApiError.badRequest("Agreements are required");
    }

    const application = await classApplicationService.submitApplication(
        applicationId,
        agreements
    );

    return successResponse(
        res,
        {
            applicationId: application._id,
            applicationNumber: application.applicationNumber,
            status: application.status,
            submittedAt: application.submittedAt,
            courses: application.courses,
            totalAmount: application.paymentInfo.totalAmount,
        },
        "Application submitted successfully"
    );
});

/**
 * Get application by ID
 * 
 * @route GET /api/v1/class-applications/:applicationId
 * @access Private
 */
const getApplicationById = asyncHandler(async (req, res) => {
    if (!req.user || !req.user.id) {
        throw ApiError.unauthorized("Authentication required");
    }

    const { applicationId } = req.params;

    const application = await classApplicationService.getApplicationById(
        applicationId,
        req.user.id
    );

    return successResponse(res, application, "Application retrieved successfully");
});

/**
 * Get user's applications
 * 
 * @route GET /api/v1/class-applications/user/:userId
 * @access Private
 */
const getUserApplications = asyncHandler(async (req, res) => {
    if (!req.user || !req.user.id) {
        throw ApiError.unauthorized("Authentication required");
    }

    const { userId } = req.params;

    // Verify user is accessing their own applications
    if (userId !== req.user.id) {
        throw ApiError.forbidden("You can only access your own applications");
    }

    const result = await classApplicationService.getUserApplications(
        userId,
        req.query
    );

    return successResponse(res, result, "Applications retrieved successfully");
});

/**
 * Cancel application
 * 
 * @route POST /api/v1/class-applications/:applicationId/cancel
 * @access Private
 */
const cancelApplication = asyncHandler(async (req, res) => {
    if (!req.user || !req.user.id) {
        throw ApiError.unauthorized("Authentication required");
    }

    const { applicationId } = req.params;
    const { reason } = req.body;

    if (!reason) {
        throw ApiError.badRequest("Cancellation reason is required");
    }

    const application = await classApplicationService.cancelApplication(
        applicationId,
        reason
    );

    return successResponse(res, application, "Application cancelled successfully");
});

/**
 * Download bulk upload template
 * 
 * @route GET /api/v1/class-applications/download-template
 * @access Public
 */
const downloadTemplate = asyncHandler(async (req, res) => {
    const template = classApplicationService.generateBulkUploadTemplate();

    return successResponse(res, template, "Template generated successfully");
});

module.exports = {
    createDraftApplication,
    validateStudent,
    addStudentToCourse,
    uploadBulkStudents,
    updatePaymentInfo,
    submitApplication,
    getApplicationById,
    getUserApplications,
    cancelApplication,
    downloadTemplate,
};
