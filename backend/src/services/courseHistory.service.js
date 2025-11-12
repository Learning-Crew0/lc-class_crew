const User = require("../models/user.model");
const Enrollment = require("../models/enrollment.model");
const TrainingSchedule = require("../models/trainingSchedule.model");
const ApiError = require("../utils/apiError.util");

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
 * Verify user identity and get course enrollment history
 * @param {Object} verificationData - { phone, email, name, type }
 * @returns {Object} User info and enrollment history
 */
const verifyCourseHistory = async ({ phone, email, name, type }) => {
    // Only support personal type for now
    if (type === "company") {
        throw ApiError.badRequest(
            "기업 회원의 수강 이력 조회는 전화 문의를 이용해주세요. (02-6914-9353)"
        );
    }

    // Find user by phone, email, and name
    const user = await User.findOne({
        phone: phone,
        email: email.toLowerCase(),
        name: name,
    });

    if (!user) {
        throw ApiError.notFound(
            "해당 정보와 일치하는 수강 이력을 찾을 수 없습니다."
        );
    }

    // Get all enrollments for this user
    const enrollments = await Enrollment.find({ user: user._id })
        .populate({
            path: "course",
            select: "title category thumbnail mainImage",
        })
        .populate({
            path: "schedule",
            select: "startDate endDate location hours",
        })
        .sort({ enrollmentDate: -1 });

    if (!enrollments || enrollments.length === 0) {
        throw ApiError.notFound(
            "해당 정보와 일치하는 수강 이력을 찾을 수 없습니다."
        );
    }

    // Format enrollments for response
    const formattedEnrollments = enrollments.map((enrollment, index) => {
        const schedule = enrollment.schedule;
        const course = enrollment.course;
        
        const attendanceData = {
            totalSessions: enrollment.attendanceRecords?.length || 0,
            attendedSessions: enrollment.attendanceRecords?.filter(r => r.attended).length || 0,
            attendanceRate: enrollment.attendancePercentage || 0,
        };

        return {
            _id: enrollment._id,
            no: enrollments.length - index, // Reverse numbering
            courseTitle: course ? `[${course.category}] ${course.title}` : "N/A",
            courseId: course?._id,
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
    });

    // Calculate summary statistics
    const stats = {
        totalEnrollments: enrollments.length,
        completedCourses: enrollments.filter((e) => e.status === "수료").length,
        inProgressCourses: enrollments.filter(
            (e) => e.status === "수강중" || e.status === "수강예정"
        ).length,
        notCompletedCourses: enrollments.filter((e) => e.status === "미수료").length,
    };

    return {
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
        },
        enrollments: formattedEnrollments,
        ...stats,
    };
};

module.exports = {
    verifyCourseHistory,
};
