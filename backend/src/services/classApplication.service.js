const ClassApplication = require("../models/classApplication.model");
const Course = require("../models/course.model");
const TrainingSchedule = require("../models/trainingSchedule.model");
const ApiError = require("../utils/apiError.util");

const createClassApplication = async (applicationData, userId = null) => {
    const course = await Course.findById(applicationData.courseId);
    if (!course) {
        throw ApiError.notFound("Course not found");
    }

    const schedule = await TrainingSchedule.findById(applicationData.scheduleId);
    if (!schedule) {
        throw ApiError.notFound("Schedule not found");
    }

    if (schedule.course.toString() !== applicationData.courseId) {
        throw ApiError.badRequest("Schedule does not belong to this course");
    }

    const application = new ClassApplication({
        ...applicationData,
        userId,
        courseName: course.title,
        scheduleDate: `${schedule.startDate.toISOString().split("T")[0]}~${schedule.endDate.toISOString().split("T")[0]}`,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    await application.save();

    return application;
};

const getAllApplications = async (filters = {}) => {
    const {
        page = 1,
        limit = 10,
        status,
        courseId,
        userId,
        search,
        startDate,
        endDate,
    } = filters;

    const query = {};

    if (status) {
        query.status = status;
    }

    if (courseId) {
        query.courseId = courseId;
    }

    if (userId) {
        query.userId = userId;
    }

    if (search) {
        query.$or = [
            { applicantName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
            { applicationNumber: { $regex: search, $options: "i" } },
        ];
    }

    if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) {
            query.createdAt.$gte = new Date(startDate);
        }
        if (endDate) {
            query.createdAt.$lte = new Date(endDate);
        }
    }

    const total = await ClassApplication.countDocuments(query);
    const applications = await ClassApplication.find(query)
        .populate("courseId", "title category")
        .populate("scheduleId", "scheduleName startDate endDate")
        .populate("userId", "fullName email phone")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    return {
        applications,
        pagination: {
            currentPage: parseInt(page, 10),
            totalPages: Math.ceil(total / limit),
            totalApplications: total,
            limit: parseInt(limit, 10),
        },
    };
};

const getApplicationById = async (id) => {
    const application = await ClassApplication.findById(id)
        .populate("courseId", "title description category price")
        .populate("scheduleId", "scheduleName startDate endDate availableSeats")
        .populate("userId", "fullName email phone memberType")
        .populate("reviewedBy", "username fullName");

    if (!application) {
        throw ApiError.notFound("Application not found");
    }

    return application;
};

const updateApplicationStatus = async (id, statusData, adminId) => {
    const application = await ClassApplication.findById(id);

    if (!application) {
        throw ApiError.notFound("Application not found");
    }

    application.status = statusData.status;
    application.reviewedBy = adminId;
    application.reviewedAt = new Date();

    if (statusData.reviewNotes) {
        application.reviewNotes = statusData.reviewNotes;
    }

    if (statusData.rejectionReason) {
        application.rejectionReason = statusData.rejectionReason;
    }

    await application.save();

    return application;
};

const cancelApplication = async (id, userId) => {
    const application = await ClassApplication.findById(id);

    if (!application) {
        throw ApiError.notFound("Application not found");
    }

    if (
        application.userId &&
        application.userId.toString() !== userId.toString()
    ) {
        throw ApiError.forbidden(
            "You are not authorized to cancel this application"
        );
    }

    if (["completed", "cancelled"].includes(application.status)) {
        throw ApiError.badRequest(
            `Cannot cancel application with status: ${application.status}`
        );
    }

    application.status = "cancelled";
    await application.save();

    return application;
};

const getUserApplications = async (userId, filters = {}) => {
    const { page = 1, limit = 10, status } = filters;

    const query = { userId };

    if (status) {
        query.status = status;
    }

    const total = await ClassApplication.countDocuments(query);
    const applications = await ClassApplication.find(query)
        .populate("courseId", "title category mainImage")
        .populate("scheduleId", "scheduleName startDate endDate")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    return {
        applications,
        pagination: {
            currentPage: parseInt(page, 10),
            totalPages: Math.ceil(total / limit),
            totalApplications: total,
            limit: parseInt(limit, 10),
        },
    };
};

const deleteApplication = async (id) => {
    const application = await ClassApplication.findByIdAndDelete(id);

    if (!application) {
        throw ApiError.notFound("Application not found");
    }

    return {
        message: "Application deleted successfully",
    };
};

module.exports = {
    createClassApplication,
    getAllApplications,
    getApplicationById,
    updateApplicationStatus,
    cancelApplication,
    getUserApplications,
    deleteApplication,
};

