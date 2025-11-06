const Inquiry = require("../models/inquiry.model");
const {
    getPaginationParams,
    createPaginationMeta,
} = require("../utils/pagination.util");
const { INQUIRY_STATUSES } = require("../constants/statuses");

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
        .populate("user", "firstName lastName email phone")
        .populate("assignedTo", "name email")
        .populate("response.respondedBy", "name email")
        .populate("notes.addedBy", "name email");

    if (!inquiry) {
        throw new Error("Inquiry not found");
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
            status: INQUIRY_STATUSES.IN_PROGRESS,
        },
        { new: true }
    );

    if (!inquiry) {
        throw new Error("Inquiry not found");
    }

    return inquiry;
};

/**
 * Add response to inquiry
 */
const respondToInquiry = async (inquiryId, adminId, message) => {
    const inquiry = await Inquiry.findById(inquiryId);

    if (!inquiry) {
        throw new Error("Inquiry not found");
    }

    inquiry.response = {
        message,
        respondedBy: adminId,
        respondedAt: Date.now(),
    };
    inquiry.status = INQUIRY_STATUSES.RESOLVED;

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
 * Delete inquiry
 */
const deleteInquiry = async (inquiryId) => {
    const inquiry = await Inquiry.findByIdAndDelete(inquiryId);

    if (!inquiry) {
        throw new Error("Inquiry not found");
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
};
