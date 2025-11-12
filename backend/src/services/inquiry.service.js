const Inquiry = require("../models/inquiry.model");
const Admin = require("../models/admin.model");
const ApiError = require("../utils/apiError.util");
const {
    getPaginationParams,
    createPaginationMeta,
} = require("../utils/pagination.util");

/**
 * Get all inquiries with filters
 */
const getAllInquiries = async (query) => {
    const { page, limit, skip } = getPaginationParams(query);

    const filter = {};

    if (query.status) {
        filter.status = query.status;
    }

    if (query.category) {
        filter.category = query.category;
    }

    if (query.priority) {
        filter.priority = query.priority;
    }

    if (query.userId) {
        filter.user = query.userId;
    }

    const inquiries = await Inquiry.find(filter)
        .populate("user", "firstName lastName email")
        .populate("assignedTo", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Inquiry.countDocuments(filter);

    return {
        inquiries,
        pagination: createPaginationMeta(page, limit, total),
    };
};

/**
 * Get inquiry by ID
 */
const getInquiryById = async (inquiryId) => {
    const inquiry = await Inquiry.findById(inquiryId)
        .populate("user", "name fullName email phone")
        .populate("assignedTo", "username fullName email")
        .populate("response.respondedBy", "username fullName email")
        .populate("notes.addedBy", "username fullName email");

    if (!inquiry) {
        throw ApiError.notFound("Inquiry not found");
    }

    return inquiry;
};

/**
 * Create inquiry
 */
const createInquiry = async (inquiryData) => {
    const inquiry = await Inquiry.create(inquiryData);
    return inquiry;
};

/**
 * Update inquiry status
 */
const updateInquiryStatus = async (inquiryId, status) => {
    const inquiry = await Inquiry.findByIdAndUpdate(
        inquiryId,
        { status },
        { new: true }
    );

    if (!inquiry) {
        throw new Error("Inquiry not found");
    }

    return inquiry;
};

/**
 * Assign inquiry to admin
 */
const assignInquiry = async (inquiryId, adminId) => {
    const inquiry = await Inquiry.findByIdAndUpdate(
        inquiryId,
        {
            assignedTo: adminId,
            status: "in_progress",
        },
        { new: true }
    );

    if (!inquiry) {
        throw ApiError.notFound("Inquiry not found");
    }

    return inquiry;
};

/**
 * Add response to inquiry
 */
const respondToInquiry = async (
    inquiryId,
    adminId,
    message,
    attachments = []
) => {
    const inquiry = await Inquiry.findById(inquiryId);

    if (!inquiry) {
        throw ApiError.notFound("Inquiry not found");
    }

    // Get admin name
    const admin = await Admin.findById(adminId);
    const respondedByName = admin ? admin.fullName || admin.username : "Admin";

    inquiry.response = {
        message,
        respondedBy: adminId,
        respondedByName,
        respondedAt: Date.now(),
        attachments: attachments || [],
    };
    inquiry.status = "resolved";

    await inquiry.save();

    return inquiry;
};

/**
 * Add note to inquiry
 */
const addNote = async (inquiryId, adminId, content) => {
    const inquiry = await Inquiry.findById(inquiryId);

    if (!inquiry) {
        throw new Error("Inquiry not found");
    }

    inquiry.notes.push({
        content,
        addedBy: adminId,
        addedAt: Date.now(),
    });

    await inquiry.save();

    return inquiry;
};

/**
 * Get user's enquiries
 */
const getMyEnquiries = async (userId, query) => {
    const { page, limit, skip } = getPaginationParams(query);

    const filter = { user: userId };

    // Filter by status
    if (query.status) {
        filter.status = query.status;
    }

    const inquiries = await Inquiry.find(filter)
        .select("ticketNumber subject category status createdAt response")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Inquiry.countDocuments(filter);

    // Format response with hasResponse flag
    const formattedInquiries = inquiries.map((inquiry) => ({
        _id: inquiry._id,
        ticketNumber: inquiry.ticketNumber,
        subject: inquiry.subject,
        category: inquiry.category,
        status: inquiry.status,
        createdAt: inquiry.createdAt,
        hasResponse: !!(inquiry.response && inquiry.response.message),
    }));

    return {
        inquiries: formattedInquiries,
        pagination: createPaginationMeta(page, limit, total),
    };
};

/**
 * Delete inquiry
 */
const deleteInquiry = async (inquiryId) => {
    const inquiry = await Inquiry.findByIdAndDelete(inquiryId);

    if (!inquiry) {
        throw ApiError.notFound("Inquiry not found");
    }

    return { message: "Inquiry deleted successfully" };
};

module.exports = {
    getAllInquiries,
    getInquiryById,
    createInquiry,
    updateInquiryStatus,
    assignInquiry,
    respondToInquiry,
    addNote,
    deleteInquiry,
    getMyEnquiries,
};
