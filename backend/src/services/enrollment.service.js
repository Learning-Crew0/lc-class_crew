const Enrollment = require("../models/enrollment.model");
const Course = require("../models/course.model");
const TrainingSchedule = require("../models/trainingSchedule.model");
const User = require("../models/user.model");
const ApiError = require("../utils/apiError.util");
const { getPaginationParams, createPaginationMeta } = require("../utils/pagination.util");
const trainingScheduleService = require("./trainingSchedule.service");

const enrollUserInSchedule = async (userId, courseId, scheduleId, enrollmentData) => {
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

    const existingEnrollment = await Enrollment.findOne({
        user: userId,
        course: courseId,
        schedule: scheduleId,
    });

    if (existingEnrollment) {
        throw ApiError.conflict("이미 해당 일정에 등록되어 있습니다");
    }

    const enrollment = await Enrollment.create({
        user: userId,
        course: courseId,
        schedule: scheduleId,
        ...enrollmentData,
    });

    await trainingScheduleService.incrementEnrolledCount(scheduleId);
    await Course.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1, enrolledCount: 1 } });

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

module.exports = {
    enrollUserInSchedule,
    getUserEnrollments,
    getEnrollmentById,
    updateEnrollmentStatus,
    updateEnrollmentProgress,
    requestRefund,
    processRefund,
    cancelEnrollment,
};
