const Enrollment = require("../models/enrollment.model");
const Course = require("../models/course.model");
const TrainingSchedule = require("../models/trainingSchedule.model");
const User = require("../models/user.model");
const ApiError = require("../utils/apiError.util");
const {
    getPaginationParams,
    createPaginationMeta,
} = require("../utils/pagination.util");
const trainingScheduleService = require("./trainingSchedule.service");

const enrollUserInSchedule = async (
    userId,
    courseId,
    scheduleId,
    enrollmentData
) => {
    const user = await User.findById(userId);
    if (!user) {
        throw ApiError.notFound("사용자를 찾을 수 없습니다");
    }

    const course = await Course.findById(courseId);
    if (!course) {
        throw ApiError.notFound("코스를 찾을 수 없습니다");
    }

    const schedule = await TrainingSchedule.findById(scheduleId);
    if (!schedule) {
        throw ApiError.notFound("일정을 찾을 수 없습니다");
    }

    if (schedule.isFull) {
        throw ApiError.badRequest("해당 일정의 좌석이 모두 찼습니다");
    }

    // Check if user is already enrolled in this course with this schedule
    const existingEnrollment = await Enrollment.findOne({
        user: userId,
        course: courseId,
        schedule: scheduleId,
        status: { $ne: "취소" }, // Exclude cancelled enrollments
    });

    if (existingEnrollment) {
        throw ApiError.conflict(
            "You have already enrolled in this course. Please check your enrollments."
        );
    }

    const enrollment = await Enrollment.create({
        user: userId,
        course: courseId,
        schedule: scheduleId,
        ...enrollmentData,
    });

    await trainingScheduleService.incrementEnrolledCount(scheduleId);
    await Course.findByIdAndUpdate(courseId, {
        $inc: { enrollmentCount: 1, enrolledCount: 1 },
    });

    return enrollment.populate([
        { path: "user", select: "fullName email phone" },
        { path: "course", select: "title mainImage price" },
        { path: "schedule", select: "scheduleName startDate endDate" },
    ]);
};

const getUserEnrollments = async (userId, query) => {
    const { page, limit, skip } = getPaginationParams(query);

    const filter = { user: userId };

    if (query.status) {
        filter.status = query.status;
    }

    const enrollments = await Enrollment.find(filter)
        .populate("course", "title mainImage price")
        .populate("schedule", "scheduleName startDate endDate")
        .sort({ enrollmentDate: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Enrollment.countDocuments(filter);

    return {
        enrollments,
        pagination: createPaginationMeta(page, limit, total),
    };
};

const getEnrollmentById = async (enrollmentId) => {
    const enrollment = await Enrollment.findById(enrollmentId)
        .populate("user", "fullName email phone")
        .populate("course", "title mainImage price")
        .populate("schedule", "scheduleName startDate endDate");

    if (!enrollment) {
        throw ApiError.notFound("수강 정보를 찾을 수 없습니다");
    }

    return enrollment;
};

const updateEnrollmentStatus = async (enrollmentId, status) => {
    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
        throw ApiError.notFound("수강 정보를 찾을 수 없습니다");
    }

    enrollment.status = status;

    if (status === "수강중" && !enrollment.startedAt) {
        enrollment.startedAt = new Date();
    }

    if (status === "수료") {
        enrollment.completedAt = new Date();
        enrollment.progress = 100;
        enrollment.certificateEligible = true;
    }

    await enrollment.save();
    return enrollment;
};

const updateEnrollmentProgress = async (enrollmentId, progress) => {
    const enrollment = await Enrollment.findByIdAndUpdate(
        enrollmentId,
        { progress, lastAccessedAt: new Date() },
        { new: true, runValidators: true }
    );

    if (!enrollment) {
        throw ApiError.notFound("수강 정보를 찾을 수 없습니다");
    }

    return enrollment;
};

const requestRefund = async (enrollmentId, refundData) => {
    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
        throw ApiError.notFound("수강 정보를 찾을 수 없습니다");
    }

    if (enrollment.refundRequested) {
        throw ApiError.badRequest("이미 환불 요청이 되어 있습니다");
    }

    enrollment.refundRequested = true;
    enrollment.refundStatus = "pending";
    enrollment.refundReason = refundData.refundReason;
    enrollment.refundAmount = refundData.refundAmount;

    await enrollment.save();
    return enrollment;
};

const processRefund = async (enrollmentId, refundStatus) => {
    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
        throw ApiError.notFound("수강 정보를 찾을 수 없습니다");
    }

    if (!enrollment.refundRequested) {
        throw ApiError.badRequest("환불 요청이 없습니다");
    }

    enrollment.refundStatus = refundStatus;

    if (refundStatus === "completed") {
        enrollment.refundDate = new Date();
        enrollment.status = "취소";
    }

    await enrollment.save();
    return enrollment;
};

const cancelEnrollment = async (enrollmentId) => {
    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
        throw ApiError.notFound("수강 정보를 찾을 수 없습니다");
    }

    if (enrollment.status === "취소") {
        throw ApiError.badRequest("이미 취소된 수강입니다");
    }

    enrollment.status = "취소";
    await enrollment.save();

    await TrainingSchedule.findByIdAndUpdate(enrollment.schedule, {
        $inc: { enrolledCount: -1 },
    });

    await Course.findByIdAndUpdate(enrollment.course, {
        $inc: { enrolledCount: -1 },
    });

    return enrollment;
};

/**
 * Format date range for display
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {string} Formatted date string "2025.07.10~2025.07.13"
 */
const formatTrainingDate = (startDate, endDate) => {
    const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}.${month}.${day}`;
    };
    return `${formatDate(startDate)}~${formatDate(endDate)}`;
};

/**
 * Get authenticated user's course enrollment history with filters
 * @param {string} userId - User ID
 * @param {Object} query - Query parameters
 * @returns {Object} Enrollments and pagination
 */
const getMyEnrollmentHistory = async (userId, query) => {
    const { page, limit, skip } = getPaginationParams(query);

    const filter = { user: userId };

    // Filter by status/completionStatus
    if (query.status) {
        const statusMap = {
            completed: "수료",
            not_completed: "미수료",
            in_progress: ["수강중", "수강예정"],
            cancelled: "취소",
        };

        const koreanStatus = statusMap[query.status];
        if (koreanStatus) {
            filter.status = Array.isArray(koreanStatus)
                ? { $in: koreanStatus }
                : koreanStatus;
        }
    }

    // Get enrollments
    const enrollments = await Enrollment.find(filter)
        .populate({
            path: "course",
            select: "title category thumbnail mainImage",
        })
        .populate({
            path: "schedule",
            select: "startDate endDate location hours",
        })
        .sort({
            [query.sortBy || "startedAt"]: query.sortOrder === "asc" ? 1 : -1,
        })
        .skip(skip)
        .limit(limit);

    const total = await Enrollment.countDocuments(filter);

    // Search in course titles if search query provided
    let filteredEnrollments = enrollments;
    if (query.search) {
        const searchLower = query.search.toLowerCase();
        filteredEnrollments = enrollments.filter(
            (e) =>
                e.course && e.course.title.toLowerCase().includes(searchLower)
        );
    }

    // Format enrollments for response
    const formattedEnrollments = filteredEnrollments.map(
        (enrollment, index) => {
            const schedule = enrollment.schedule;
            const course = enrollment.course;

            const attendanceData = {
                totalSessions: enrollment.attendanceRecords?.length || 0,
                attendedSessions:
                    enrollment.attendanceRecords?.filter((r) => r.attended)
                        .length || 0,
                attendanceRate: enrollment.attendancePercentage || 0,
            };

            return {
                _id: enrollment._id,
                no: total - (skip + index), // Reverse numbering based on total
                courseTitle: course
                    ? `[${course.category}] ${course.title}`
                    : "N/A",
                courseId: course?._id,
                course: course
                    ? {
                          _id: course._id,
                          title: course.title,
                          category: course.category,
                          thumbnail: course.thumbnail || course.mainImage,
                      }
                    : null,
                trainingDate: schedule
                    ? formatTrainingDate(schedule.startDate, schedule.endDate)
                    : "N/A",
                startDate: schedule?.startDate,
                endDate: schedule?.endDate,
                status: enrollment.status,
                completionStatus: enrollment.completionStatus,
                certificateUrl: enrollment.certificateUrl,
                certificateAvailable: enrollment.certificateAvailable,
                completionDate: enrollment.completedAt,
                grade: enrollment.grade,
                attendance: attendanceData,
                enrolledAt: enrollment.enrollmentDate,
            };
        }
    );

    return {
        enrollments: formattedEnrollments,
        pagination: createPaginationMeta(page, limit, total),
    };
};

/**
 * Get certificate download info
 * @param {string} enrollmentId - Enrollment ID
 * @param {string} userId - User ID (for authorization)
 * @returns {Object} Certificate info
 */
const getCertificateInfo = async (enrollmentId, userId) => {
    const enrollment = await Enrollment.findOne({
        _id: enrollmentId,
        user: userId,
    }).populate("course", "title");

    if (!enrollment) {
        throw ApiError.notFound("수강 정보를 찾을 수 없습니다");
    }

    if (!enrollment.certificateAvailable) {
        throw ApiError.badRequest(
            "수료증을 다운로드할 수 없습니다. 과정이 아직 완료되지 않았습니다."
        );
    }

    return {
        certificateUrl: enrollment.certificateUrl,
        courseTitle: enrollment.course?.title,
        completionDate: enrollment.completedAt,
    };
};

/**
 * Get user's enrolled courses for learning status page
 * @param {String} userId - User ID
 * @returns {Array} List of enrolled courses with status and dates
 */
const getEnrolledCoursesForLearningStatus = async (userId) => {
    const enrollments = await Enrollment.find({
        user: userId,
        status: { $ne: "취소" }, // Exclude cancelled enrollments
    })
        .populate("course", "title mainImage refundOptions")
        .populate("schedule", "startDate endDate")
        .sort({ enrollmentDate: -1 });

    // Status priority for sorting: 수강예정 > 수강중 > 미수료 > 수료
    const statusPriority = {
        수강예정: 1,
        수강중: 2,
        미수료: 3,
        수료: 4,
    };

    const courses = enrollments.map((enrollment, index) => {
        // Determine course type from refundOptions field
        // If refundOptions contains keywords like "환급", "지원", it's refundable
        let courseType = "비환급"; // Default to non-refundable
        if (enrollment.course?.refundOptions) {
            const refundText = enrollment.course.refundOptions.toLowerCase();
            if (refundText.includes("환급") || refundText.includes("지원")) {
                courseType = "환급";
            }
        }

        const course = {
            no: index + 1, // Row number for display
            _id: enrollment._id, // Enrollment ID
            courseId: enrollment.course?._id || null,
            enrollmentNumber: enrollment.enrollmentNumber, // ENR-xxxxx
            title: enrollment.course?.title || "제목 없음",
            type: courseType, // 환급 or 비환급
            startDate:
                enrollment.schedule?.startDate || enrollment.enrollmentDate,
            endDate: enrollment.schedule?.endDate || null,
            status: enrollment.status || "수강예정",
            enrolledAt: enrollment.enrollmentDate,
            progress: enrollment.progress || 0,
            mainImage: enrollment.course?.mainImage || null,
        };

        // Only include certificateUrl for completed courses
        if (enrollment.status === "수료" && enrollment.certificateUrl) {
            course.certificateUrl = enrollment.certificateUrl;
        }

        return course;
    });

    // Sort by status priority, then by enrollment date (recent first)
    courses.sort((a, b) => {
        const priorityDiff =
            (statusPriority[a.status] || 5) - (statusPriority[b.status] || 5);
        if (priorityDiff !== 0) return priorityDiff;
        return new Date(b.enrolledAt) - new Date(a.enrolledAt);
    });

    // Re-assign row numbers after sorting
    courses.forEach((course, index) => {
        course.no = index + 1;
    });

    return courses;
};

/**
 * Get all enrollments for admin with advanced filtering
 * @param {Object} filters - Filter parameters
 * @returns {Object} Enrollments and pagination
 */
const getAllEnrollmentsAdmin = async (filters) => {
    const { page, limit, skip } = getPaginationParams(filters);

    const query = {};

    // Filter by course name
    if (filters.courseName) {
        const courses = await Course.find({
            title: { $regex: filters.courseName, $options: "i" },
        }).select("_id");
        query.course = { $in: courses.map((c) => c._id) };
    }

    // Filter by student name
    if (filters.learnerName) {
        const users = await User.find({
            fullName: { $regex: filters.learnerName, $options: "i" },
        }).select("_id");
        query.user = { $in: users.map((u) => u._id) };
    }

    // Filter by student email
    if (filters.learnerEmail) {
        const users = await User.find({
            email: { $regex: filters.learnerEmail, $options: "i" },
        }).select("_id");
        query.user = { $in: users.map((u) => u._id) };
    }

    // Filter by status
    if (filters.status) {
        // Map English status to Korean
        const statusMap = {
            confirmed: "수강예정",
            pending: "수강예정",
            ongoing: "수강중",
            completed: "수료",
            cancelled: "취소",
        };
        query.status = statusMap[filters.status] || filters.status;
    }

    // Filter by training schedule date range
    if (filters.startDate || filters.endDate) {
        const scheduleQuery = {};
        if (filters.startDate) {
            scheduleQuery.startDate = { $gte: new Date(filters.startDate) };
        }
        if (filters.endDate) {
            scheduleQuery.endDate = { $lte: new Date(filters.endDate) };
        }
        const schedules =
            await TrainingSchedule.find(scheduleQuery).select("_id");
        query.schedule = { $in: schedules.map((s) => s._id) };
    }

    // Get enrollments
    const enrollments = await Enrollment.find(query)
        .populate({
            path: "user",
            select: "fullName email phone company department memberType",
        })
        .populate({
            path: "course",
            select: "title mainImage price",
        })
        .populate({
            path: "schedule",
            select: "scheduleName startDate endDate",
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Enrollment.countDocuments(query);

    // Format enrollments for admin view
    const formattedEnrollments = enrollments.map((enrollment) => {
        const user = enrollment.user;
        const schedule = enrollment.schedule;

        return {
            _id: enrollment._id,
            studentInfo: {
                name: user?.fullName || "N/A",
                email: user?.email || "N/A",
                phone: user?.phone || "N/A",
                company: user?.company || "N/A",
                department: user?.department || "N/A",
                position: user?.memberType || "N/A",
            },
            course: {
                _id: enrollment.course?._id,
                title: enrollment.course?.title || "N/A",
            },
            trainingSchedule: schedule
                ? {
                      _id: schedule._id,
                      startDate: schedule.startDate,
                      endDate: schedule.endDate,
                      scheduleName: schedule.scheduleName,
                  }
                : null,
            status: enrollment.status,
            paymentInfo: {
                method: enrollment.paymentMethod || "N/A",
                amount: enrollment.amountPaid || 0,
                status: enrollment.paymentStatus || "pending",
            },
            completed: enrollment.status === "수료",
            completionDate: enrollment.completedAt,
            certificateIssued: enrollment.certificateIssued,
            enrollmentNumber: enrollment.enrollmentNumber,
            createdAt: enrollment.createdAt,
            updatedAt: enrollment.updatedAt,
        };
    });

    return {
        enrollments: formattedEnrollments,
        pagination: createPaginationMeta(page, limit, total),
    };
};

/**
 * Mark enrollment as completed (admin)
 * @param {string} enrollmentId
 * @param {Object} data - { completed, completionDate, certificateIssued }
 * @returns {Object} Updated enrollment
 */
const markEnrollmentCompleted = async (enrollmentId, data) => {
    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
        throw ApiError.notFound("수강 정보를 찾을 수 없습니다");
    }

    if (data.completed) {
        enrollment.status = "수료";
        enrollment.completedAt = data.completionDate
            ? new Date(data.completionDate)
            : new Date();
        enrollment.progress = 100;
        enrollment.certificateEligible = true;
    }

    if (data.certificateIssued !== undefined) {
        enrollment.certificateIssued = data.certificateIssued;
        if (data.certificateIssued && !enrollment.certificateIssuedAt) {
            enrollment.certificateIssuedAt = new Date();
        }
    }

    await enrollment.save();
    return enrollment;
};

/**
 * Bulk update enrollments (admin)
 * @param {Array} enrollmentIds
 * @param {Object} updateData
 * @returns {Object} Update result
 */
const bulkUpdateEnrollments = async (enrollmentIds, updateData) => {
    const updates = {};

    if (updateData.completed) {
        updates.status = "수료";
        updates.completedAt = updateData.completionDate
            ? new Date(updateData.completionDate)
            : new Date();
        updates.progress = 100;
        updates.certificateEligible = true;
    }

    if (updateData.issueCertificates) {
        updates.certificateIssued = true;
        updates.certificateIssuedAt = new Date();
    }

    const result = await Enrollment.updateMany(
        { _id: { $in: enrollmentIds } },
        { $set: updates }
    );

    return {
        updatedCount: result.modifiedCount,
        failedIds: [],
    };
};

/**
 * Get enrollments for export (admin)
 * @param {Object} filters
 * @returns {Array} Enrollments for export
 */
const getEnrollmentsForExport = async (filters) => {
    const query = {};

    // Apply same filters as getAllEnrollmentsAdmin but without pagination
    if (filters.courseName) {
        const courses = await Course.find({
            title: { $regex: filters.courseName, $options: "i" },
        }).select("_id");
        query.course = { $in: courses.map((c) => c._id) };
    }

    if (filters.learnerName) {
        const users = await User.find({
            fullName: { $regex: filters.learnerName, $options: "i" },
        }).select("_id");
        query.user = { $in: users.map((u) => u._id) };
    }

    if (filters.learnerEmail) {
        const users = await User.find({
            email: { $regex: filters.learnerEmail, $options: "i" },
        }).select("_id");
        query.user = { $in: users.map((u) => u._id) };
    }

    if (filters.status) {
        const statusMap = {
            confirmed: "수강예정",
            pending: "수강예정",
            ongoing: "수강중",
            completed: "수료",
            cancelled: "취소",
        };
        query.status = statusMap[filters.status] || filters.status;
    }

    if (filters.startDate || filters.endDate) {
        const scheduleQuery = {};
        if (filters.startDate) {
            scheduleQuery.startDate = { $gte: new Date(filters.startDate) };
        }
        if (filters.endDate) {
            scheduleQuery.endDate = { $lte: new Date(filters.endDate) };
        }
        const schedules =
            await TrainingSchedule.find(scheduleQuery).select("_id");
        query.schedule = { $in: schedules.map((s) => s._id) };
    }

    const enrollments = await Enrollment.find(query)
        .populate({
            path: "user",
            select: "fullName email phone company department memberType",
        })
        .populate({
            path: "course",
            select: "title",
        })
        .populate({
            path: "schedule",
            select: "scheduleName startDate endDate",
        })
        .sort({ createdAt: -1 });

    return enrollments;
};

module.exports = {
    enrollUserInSchedule,
    getUserEnrollments,
    getEnrollmentById,
    updateEnrollmentStatus,
    updateEnrollmentProgress,
    requestRefund,
    processRefund,
    cancelEnrollment,
    getMyEnrollmentHistory,
    getCertificateInfo,
    getEnrolledCoursesForLearningStatus,
    // Admin functions
    getAllEnrollmentsAdmin,
    markEnrollmentCompleted,
    bulkUpdateEnrollments,
    getEnrollmentsForExport,
};
