const inquiryService = require("../services/inquiry.service");
const {
    successResponse,
    paginatedResponse,
} = require("../utils/response.util");

/**
 * Get all inquiries
 */
const getAllInquiries = async (req, res, next) => {
    try {
        const { inquiries, pagination } = await inquiryService.getAllInquiries(
            req.query
        );
        return paginatedResponse(
            res,
            inquiries,
            pagination,
            "Inquiries retrieved successfully"
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Get inquiry by ID
 */
const getInquiryById = async (req, res, next) => {
    try {
        const inquiry = await inquiryService.getInquiryById(req.params.id);
        return successResponse(res, inquiry, "Inquiry retrieved successfully");
    } catch (error) {
        next(error);
    }
};

/**
 * Create inquiry
 */
const createInquiry = async (req, res, next) => {
    try {
        // Attach user ID if authenticated
        if (req.user) {
            req.body.user = req.user.id;
        }

        // Track IP and User Agent
        req.body.ipAddress = req.ip || req.connection.remoteAddress;
        req.body.userAgent = req.get("user-agent");

        const inquiry = await inquiryService.createInquiry(req.body);
        return successResponse(
            res,
            inquiry,
            "Enquiry submitted successfully",
            201
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Update inquiry status
 */
const updateStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const inquiry = await inquiryService.updateInquiryStatus(
            req.params.id,
            status
        );
        return successResponse(
            res,
            inquiry,
            "Inquiry status updated successfully"
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Assign inquiry
 */
const assignInquiry = async (req, res, next) => {
    try {
        const { adminId } = req.body;
        const inquiry = await inquiryService.assignInquiry(
            req.params.id,
            adminId
        );
        return successResponse(res, inquiry, "Inquiry assigned successfully");
    } catch (error) {
        next(error);
    }
};

/**
 * Respond to inquiry
 */
const respondToInquiry = async (req, res, next) => {
    try {
        const { message, attachments } = req.body;
        const inquiry = await inquiryService.respondToInquiry(
            req.params.id,
            req.user.id,
            message,
            attachments
        );
        return successResponse(res, inquiry, "Response added successfully");
    } catch (error) {
        next(error);
    }
};

/**
 * Add note to inquiry
 */
const addNote = async (req, res, next) => {
    try {
        const { content } = req.body;
        const inquiry = await inquiryService.addNote(
            req.params.id,
            req.user.id,
            content
        );
        return successResponse(res, inquiry, "Note added successfully");
    } catch (error) {
        next(error);
    }
};

/**
 * Get my enquiries (authenticated user)
 */
const getMyEnquiries = async (req, res, next) => {
    try {
        const { inquiries, pagination } = await inquiryService.getMyEnquiries(
            req.user.id,
            req.query
        );
        return paginatedResponse(
            res,
            inquiries,
            pagination,
            "Enquiries retrieved successfully"
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Delete inquiry
 */
const deleteInquiry = async (req, res, next) => {
    try {
        const result = await inquiryService.deleteInquiry(req.params.id);
        return successResponse(res, result, "Inquiry deleted successfully");
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllInquiries,
    getInquiryById,
    createInquiry,
    updateStatus,
    assignInquiry,
    respondToInquiry,
    addNote,
    deleteInquiry,
    getMyEnquiries,
};
