const Coalition = require("../models/coalition.model");
const asyncHandler = require("../utils/asyncHandler.util");
const ApiError = require("../utils/apiError.util");
const { successResponse, paginatedResponse } = require("../utils/response.util");
const { getFileUrl, deleteFileByUrl } = require("../config/fileStorage");

/**
 * Create coalition application (Public endpoint)
 * 
 * @route POST /api/v1/coalitions
 * @access Public
 */
const createCoalition = asyncHandler(async (req, res) => {
    const { name, affiliation, field, contact, email } = req.body;

    // Validate required fields
    if (!name || !affiliation || !field || !contact || !email) {
        throw ApiError.badRequest("All fields are required", {
            name: !name ? "Name is required" : undefined,
            affiliation: !affiliation ? "Affiliation is required" : undefined,
            field: !field ? "Field is required" : undefined,
            contact: !contact ? "Contact number is required" : undefined,
            email: !email ? "Email is required" : undefined,
        });
    }

    // Validate file upload
    if (!req.file) {
        throw ApiError.badRequest("Profile/Reference file is required", {
            file: "Profile/Reference file is required",
        });
    }

    // Validate phone number format
    if (!/^01[0-1]\d{8}$/.test(contact)) {
        throw ApiError.badRequest(
            "Contact number must be 11 digits (Korean format: 010XXXXXXXX)"
        );
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw ApiError.badRequest("Please provide a valid email");
    }

    // Check for duplicate email
    const existingApplication = await Coalition.findOne({ email });
    if (existingApplication) {
        throw ApiError.conflict("An application with this email already exists");
    }

    // Create file URL
    const fileUrl = getFileUrl("COALITIONS", req.file.filename);

    // Create coalition application
    const coalition = await Coalition.create({
        name: name.trim(),
        affiliation: affiliation.trim(),
        field: field.trim(),
        contact: contact.trim(),
        email: email.toLowerCase().trim(),
        file: fileUrl,
        fileOriginalName: req.file.originalname,
        status: "pending",
    });

    return successResponse(
        res,
        coalition,
        "Coalition application submitted successfully",
        201
    );
});

/**
 * Get all coalition applications (Admin only)
 * 
 * @route GET /api/v1/coalitions
 * @access Private/Admin
 */
const getAllCoalitions = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        status,
        search,
        sortBy = "createdAt",
        sortOrder = "desc",
    } = req.query;

    // Build query
    const query = {};

    // Filter by status
    if (status && ["pending", "approved", "rejected"].includes(status)) {
        query.status = status;
    }

    // Search in name, email, affiliation
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { affiliation: { $regex: search, $options: "i" } },
            { field: { $regex: search, $options: "i" } },
        ];
    }

    // Calculate pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Execute query
    const [coalitions, total] = await Promise.all([
        Coalition.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum)
            .select("-__v")
            .lean(),
        Coalition.countDocuments(query),
    ]);

    const pagination = {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
        hasNextPage: pageNum * limitNum < total,
        hasPrevPage: pageNum > 1,
    };

    return paginatedResponse(
        res,
        { coalitions },
        pagination,
        "Coalition applications retrieved successfully"
    );
});

/**
 * Get single coalition application by ID (Admin only)
 * 
 * @route GET /api/v1/coalitions/:id
 * @access Private/Admin
 */
const getCoalitionById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const coalition = await Coalition.findById(id).select("-__v");

    if (!coalition) {
        throw ApiError.notFound("Coalition application not found");
    }

    return successResponse(
        res,
        coalition,
        "Coalition application retrieved successfully"
    );
});

/**
 * Update coalition status (Admin only)
 * 
 * @route PATCH /api/v1/coalitions/:id/status
 * @access Private/Admin
 */
const updateCoalitionStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    // Validate status
    if (!["pending", "approved", "rejected"].includes(status)) {
        throw ApiError.badRequest(
            "Invalid status. Must be one of: pending, approved, rejected"
        );
    }

    // Find and update coalition
    const coalition = await Coalition.findById(id);

    if (!coalition) {
        throw ApiError.notFound("Coalition application not found");
    }

    coalition.status = status;
    if (adminNotes !== undefined) {
        coalition.adminNotes = adminNotes;
    }

    await coalition.save();

    return successResponse(
        res,
        {
            _id: coalition._id,
            name: coalition.name,
            email: coalition.email,
            status: coalition.status,
            adminNotes: coalition.adminNotes,
            updatedAt: coalition.updatedAt,
        },
        "Status updated successfully"
    );
});

/**
 * Delete coalition application (Admin only)
 * 
 * @route DELETE /api/v1/coalitions/:id
 * @access Private/Admin
 */
const deleteCoalition = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const coalition = await Coalition.findById(id);

    if (!coalition) {
        throw ApiError.notFound("Coalition application not found");
    }

    // Delete associated file
    if (coalition.file) {
        deleteFileByUrl(coalition.file);
    }

    await Coalition.findByIdAndDelete(id);

    return successResponse(
        res,
        null,
        "Coalition application deleted successfully"
    );
});

/**
 * Get coalition statistics (Admin only)
 * 
 * @route GET /api/v1/coalitions/stats
 * @access Private/Admin
 */
const getCoalitionStats = asyncHandler(async (req, res) => {
    // Get total count
    const total = await Coalition.countDocuments();

    // Get count by status
    const [pendingCount, approvedCount, rejectedCount] = await Promise.all([
        Coalition.countDocuments({ status: "pending" }),
        Coalition.countDocuments({ status: "approved" }),
        Coalition.countDocuments({ status: "rejected" }),
    ]);

    // Get counts for different time periods
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const [todayCount, weekCount, monthCount] = await Promise.all([
        Coalition.countDocuments({ createdAt: { $gte: today } }),
        Coalition.countDocuments({ createdAt: { $gte: weekAgo } }),
        Coalition.countDocuments({ createdAt: { $gte: monthAgo } }),
    ]);

    // Get recent applications (last 5)
    const recentApplications = await Coalition.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name affiliation status createdAt")
        .lean();

    // Get top fields
    const topFields = await Coalition.aggregate([
        {
            $group: {
                _id: "$field",
                count: { $sum: 1 },
            },
        },
        {
            $sort: { count: -1 },
        },
        {
            $limit: 5,
        },
        {
            $project: {
                _id: 0,
                field: "$_id",
                count: 1,
            },
        },
    ]);

    const stats = {
        total,
        byStatus: {
            pending: pendingCount,
            approved: approvedCount,
            rejected: rejectedCount,
        },
        today: todayCount,
        thisWeek: weekCount,
        thisMonth: monthCount,
        recentApplications,
        topFields,
    };

    return successResponse(res, stats, "Statistics retrieved successfully");
});

module.exports = {
    createCoalition,
    getAllCoalitions,
    getCoalitionById,
    updateCoalitionStatus,
    deleteCoalition,
    getCoalitionStats,
};

