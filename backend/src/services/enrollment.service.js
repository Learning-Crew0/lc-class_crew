const Enrollment = require("../models/enrollment.model");
const Course = require("../models/course.model");
const {
  getPaginationParams,
  createPaginationMeta,
} = require("../utils/pagination.util");
const { ENROLLMENT_STATUSES } = require("../constants/statuses");

/**
 * Get all enrollments with filters
 */
const getAllEnrollments = async (query) => {
  const { page, limit, skip } = getPaginationParams(query);

  const filter = {};

  if (query.userId) {
    filter.user = query.userId;
  }

  if (query.courseId) {
    filter.course = query.courseId;
  }

  if (query.status) {
    filter.status = query.status;
  }

  const enrollments = await Enrollment.find(filter)
    .populate("user", "firstName lastName email")
    .populate("course", "title instructor startDate endDate")
    .sort({ enrolledAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Enrollment.countDocuments(filter);

  return {
    enrollments,
    pagination: createPaginationMeta(page, limit, total),
  };
};

/**
 * Get enrollment by ID
 */
const getEnrollmentById = async (enrollmentId) => {
  const enrollment = await Enrollment.findById(enrollmentId)
    .populate("user", "firstName lastName email phone")
    .populate("course");

  if (!enrollment) {
    throw new Error("Enrollment not found");
  }

  return enrollment;
};

/**
 * Create enrollment
 */
const createEnrollment = async (userId, courseId) => {
  // Check if course exists
  const course = await Course.findById(courseId);

  if (!course) {
    throw new Error("Course not found");
  }

  if (!course.isPublished) {
    throw new Error("Course is not available for enrollment");
  }

  // Check if already enrolled
  const existingEnrollment = await Enrollment.findOne({
    user: userId,
    course: courseId,
  });

  if (existingEnrollment) {
    throw new Error("Already enrolled in this course");
  }

  // Create enrollment with attendance tracking for all sessions
  const attendance = course.sessions.map((session) => ({
    sessionId: session._id,
    attended: false,
  }));

  const enrollment = await Enrollment.create({
    user: userId,
    course: courseId,
    attendance,
    status: ENROLLMENT_STATUSES.ACTIVE,
  });

  // Update course enrollment count
  course.enrollmentCount += 1;
  await course.save();

  return enrollment;
};

/**
 * Update enrollment status
 */
const updateEnrollmentStatus = async (enrollmentId, status) => {
  const enrollment = await Enrollment.findById(enrollmentId);

  if (!enrollment) {
    throw new Error("Enrollment not found");
  }

  enrollment.status = status;

  if (status === ENROLLMENT_STATUSES.COMPLETED) {
    enrollment.completedAt = Date.now();
  }

  await enrollment.save();

  return enrollment;
};

/**
 * Mark attendance
 */
const markAttendance = async (enrollmentId, sessionId, attended) => {
  const enrollment = await Enrollment.findById(enrollmentId);

  if (!enrollment) {
    throw new Error("Enrollment not found");
  }

  const attendanceRecord = enrollment.attendance.find(
    (a) => a.sessionId.toString() === sessionId
  );

  if (!attendanceRecord) {
    throw new Error("Session not found in enrollment");
  }

  attendanceRecord.attended = attended;
  attendanceRecord.attendedAt = attended ? Date.now() : null;

  await enrollment.save();

  return enrollment;
};

/**
 * Add assessment score
 */
const addAssessment = async (enrollmentId, assessmentData) => {
  const enrollment = await Enrollment.findById(enrollmentId);

  if (!enrollment) {
    throw new Error("Enrollment not found");
  }

  enrollment.assessments.push({
    ...assessmentData,
    submittedAt: Date.now(),
    gradedAt: Date.now(),
  });

  await enrollment.save();

  return enrollment;
};

/**
 * Get user's enrollments
 */
const getUserEnrollments = async (userId) => {
  const enrollments = await Enrollment.find({ user: userId })
    .populate("course")
    .sort({ enrolledAt: -1 });

  return enrollments;
};

/**
 * Delete enrollment
 */
const deleteEnrollment = async (enrollmentId) => {
  const enrollment = await Enrollment.findById(enrollmentId);

  if (!enrollment) {
    throw new Error("Enrollment not found");
  }

  // Decrease course enrollment count
  await Course.findByIdAndUpdate(enrollment.course, {
    $inc: { enrollmentCount: -1 },
  });

  await enrollment.deleteOne();

  return { message: "Enrollment deleted successfully" };
};

module.exports = {
  getAllEnrollments,
  getEnrollmentById,
  createEnrollment,
  updateEnrollmentStatus,
  markAttendance,
  addAssessment,
  getUserEnrollments,
  deleteEnrollment,
};
