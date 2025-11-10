const StudentEnrollment = require("../models/studentEnrollment.model");
const ApiError = require("../utils/apiError.util");

/**
 * Get student's enrollments
 * 
 * @param {String} studentId 
 * @param {Object} filters - { status, page, limit }
 * @returns {Promise<Object>}
 */
const getStudentEnrollments = async (studentId, filters = {}) => {
    const { status, page = 1, limit = 10 } = filters;

    const query = { student: studentId };

    if (status) {
        query.enrollmentStatus = status;
    }

    const total = await StudentEnrollment.countDocuments(query);
    const enrollments = await StudentEnrollment.find(query)
        .populate("course", "title description mainImage price")
        .populate("trainingSchedule", "scheduleName startDate endDate")
        .populate("classApplication", "applicationNumber")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    return {
        enrollments,
        pagination: {
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
        },
    };
};

/**
 * Get enrollment by ID
 * 
 * @param {String} enrollmentId 
 * @param {String} studentId - Optional: for ownership verification
 * @returns {Promise<StudentEnrollment>}
 */
const getEnrollmentById = async (enrollmentId, studentId = null) => {
    const enrollment = await StudentEnrollment.findById(enrollmentId)
        .populate("course")
        .populate("trainingSchedule")
        .populate("classApplication")
        .populate("student", "fullName email phone");

    if (!enrollment) {
        throw ApiError.notFound("Enrollment not found");
    }

    // Verify ownership if studentId provided
    if (studentId && enrollment.student._id.toString() !== studentId) {
        throw ApiError.forbidden(
            "You do not have permission to access this enrollment"
        );
    }

    return enrollment;
};

/**
 * Add attendance record
 * 
 * @param {String} enrollmentId 
 * @param {Object} attendanceData - { date, status, notes }
 * @returns {Promise<StudentEnrollment>}
 */
const addAttendanceRecord = async (enrollmentId, attendanceData) => {
    const enrollment = await StudentEnrollment.findById(enrollmentId);

    if (!enrollment) {
        throw ApiError.notFound("Enrollment not found");
    }

    if (enrollment.enrollmentStatus === "cancelled") {
        throw ApiError.badRequest("Cannot add attendance to cancelled enrollment");
    }

    enrollment.attendanceRecords.push(attendanceData);

    // Update completion percentage based on attendance
    const totalSessions = enrollment.attendanceRecords.length;
    const presentSessions = enrollment.attendanceRecords.filter(
        (record) => record.status === "present"
    ).length;

    enrollment.completionPercentage = (presentSessions / totalSessions) * 100;

    await enrollment.save();

    return enrollment;
};

/**
 * Mark enrollment as completed
 * 
 * @param {String} enrollmentId 
 * @returns {Promise<StudentEnrollment>}
 */
const completeEnrollment = async (enrollmentId) => {
    const enrollment = await StudentEnrollment.findById(enrollmentId);

    if (!enrollment) {
        throw ApiError.notFound("Enrollment not found");
    }

    if (enrollment.enrollmentStatus === "cancelled") {
        throw ApiError.badRequest("Cannot complete cancelled enrollment");
    }

    enrollment.enrollmentStatus = "completed";
    enrollment.completionDate = new Date();

    await enrollment.save();

    return enrollment;
};

/**
 * Issue certificate
 * 
 * @param {String} enrollmentId 
 * @param {String} certificateUrl 
 * @returns {Promise<StudentEnrollment>}
 */
const issueCertificate = async (enrollmentId, certificateUrl) => {
    const enrollment = await StudentEnrollment.findById(enrollmentId);

    if (!enrollment) {
        throw ApiError.notFound("Enrollment not found");
    }

    if (enrollment.enrollmentStatus !== "completed") {
        throw ApiError.badRequest(
            "Certificate can only be issued for completed enrollments"
        );
    }

    enrollment.certificateIssued = true;
    enrollment.certificateIssuedDate = new Date();
    enrollment.certificateUrl = certificateUrl;

    await enrollment.save();

    return enrollment;
};

/**
 * Cancel enrollment
 * 
 * @param {String} enrollmentId 
 * @param {String} reason 
 * @returns {Promise<StudentEnrollment>}
 */
const cancelEnrollment = async (enrollmentId, reason) => {
    const enrollment = await StudentEnrollment.findById(enrollmentId);

    if (!enrollment) {
        throw ApiError.notFound("Enrollment not found");
    }

    if (enrollment.enrollmentStatus === "completed") {
        throw ApiError.badRequest("Cannot cancel completed enrollment");
    }

    enrollment.enrollmentStatus = "cancelled";
    enrollment.cancellationReason = reason;
    enrollment.cancelledAt = new Date();

    await enrollment.save();

    return enrollment;
};

/**
 * Get enrollment statistics for a course
 * 
 * @param {String} courseId 
 * @param {String} scheduleId - Optional
 * @returns {Promise<Object>}
 */
const getCourseEnrollmentStats = async (courseId, scheduleId = null) => {
    const query = { course: courseId };

    if (scheduleId) {
        query.trainingSchedule = scheduleId;
    }

    const enrollments = await StudentEnrollment.find(query);

    const stats = {
        total: enrollments.length,
        enrolled: 0,
        completed: 0,
        cancelled: 0,
        noShow: 0,
        averageAttendanceRate: 0,
        certificatesIssued: 0,
    };

    let totalAttendanceRate = 0;

    enrollments.forEach((enrollment) => {
        // Count by status
        stats[enrollment.enrollmentStatus] =
            (stats[enrollment.enrollmentStatus] || 0) + 1;

        // Certificate count
        if (enrollment.certificateIssued) {
            stats.certificatesIssued++;
        }

        // Attendance rate
        if (enrollment.attendanceRecords.length > 0) {
            const presentCount = enrollment.attendanceRecords.filter(
                (r) => r.status === "present"
            ).length;
            const attendanceRate =
                (presentCount / enrollment.attendanceRecords.length) * 100;
            totalAttendanceRate += attendanceRate;
        }
    });

    // Calculate average attendance rate
    if (enrollments.length > 0) {
        stats.averageAttendanceRate = totalAttendanceRate / enrollments.length;
    }

    return stats;
};

module.exports = {
    getStudentEnrollments,
    getEnrollmentById,
    addAttendanceRecord,
    completeEnrollment,
    issueCertificate,
    cancelEnrollment,
    getCourseEnrollmentStats,
};

