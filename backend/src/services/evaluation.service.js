const Enrollment = require("../models/enrollment.model");
const Course = require("../models/course.model");

/**
 * Check if student is eligible for certificate
 */
const checkCertificateEligibility = async (enrollmentId) => {
  const enrollment = await Enrollment.findById(enrollmentId).populate("course");

  if (!enrollment) {
    throw new Error("Enrollment not found");
  }

  const course = enrollment.course;

  if (!course.certificateEligibility.enabled) {
    return {
      eligible: false,
      reason: "Course does not offer certificates",
    };
  }

  // Calculate attendance percentage
  const attendancePercentage = enrollment.attendancePercentage;
  const minAttendance = course.certificateEligibility.criteria.minAttendance;

  // Calculate average assessment scores by type
  const assignments = enrollment.assessments.filter(
    (a) => a.type === "assignment"
  );
  const tests = enrollment.assessments.filter((a) => a.type === "test");

  const avgAssignmentScore =
    assignments.length > 0
      ? assignments.reduce((sum, a) => sum + (a.score / a.maxScore) * 100, 0) /
        assignments.length
      : 0;

  const avgTestScore =
    tests.length > 0
      ? tests.reduce((sum, a) => sum + (a.score / a.maxScore) * 100, 0) /
        tests.length
      : 0;

  const minAssignmentScore =
    course.certificateEligibility.criteria.minAssignmentScore;
  const minTestScore = course.certificateEligibility.criteria.minTestScore;

  // Check eligibility
  const reasons = [];

  if (attendancePercentage < minAttendance) {
    reasons.push(
      `Attendance ${attendancePercentage}% is below required ${minAttendance}%`
    );
  }

  if (assignments.length > 0 && avgAssignmentScore < minAssignmentScore) {
    reasons.push(
      `Assignment score ${avgAssignmentScore.toFixed(2)}% is below required ${minAssignmentScore}%`
    );
  }

  if (tests.length > 0 && avgTestScore < minTestScore) {
    reasons.push(
      `Test score ${avgTestScore.toFixed(2)}% is below required ${minTestScore}%`
    );
  }

  const eligible = reasons.length === 0;

  return {
    eligible,
    reasons: eligible ? [] : reasons,
    metrics: {
      attendancePercentage,
      avgAssignmentScore: avgAssignmentScore.toFixed(2),
      avgTestScore: avgTestScore.toFixed(2),
      requirements: {
        minAttendance,
        minAssignmentScore,
        minTestScore,
      },
    },
  };
};

/**
 * Issue certificate
 */
const issueCertificate = async (enrollmentId) => {
  const eligibility = await checkCertificateEligibility(enrollmentId);

  if (!eligibility.eligible) {
    throw new Error(
      `Not eligible for certificate: ${eligibility.reasons.join(", ")}`
    );
  }

  const enrollment = await Enrollment.findById(enrollmentId);

  if (enrollment.certificateIssued) {
    throw new Error("Certificate already issued");
  }

  // Generate certificate URL (implement actual certificate generation)
  const certificateUrl = `/certificates/${enrollmentId}.pdf`;

  enrollment.certificateIssued = true;
  enrollment.certificateIssuedAt = Date.now();
  enrollment.certificateUrl = certificateUrl;

  await enrollment.save();

  return enrollment;
};

/**
 * Get enrollment progress report
 */
const getProgressReport = async (enrollmentId) => {
  const enrollment = await Enrollment.findById(enrollmentId).populate("course");

  if (!enrollment) {
    throw new Error("Enrollment not found");
  }

  const attendancePercentage = enrollment.attendancePercentage;
  const averageScore = enrollment.averageScore;

  const eligibility = await checkCertificateEligibility(enrollmentId);

  return {
    enrollment: {
      id: enrollment._id,
      status: enrollment.status,
      enrolledAt: enrollment.enrolledAt,
      completedAt: enrollment.completedAt,
    },
    course: {
      id: enrollment.course._id,
      title: enrollment.course.title,
      instructor: enrollment.course.instructor,
    },
    progress: {
      attendancePercentage,
      averageScore,
      totalSessions: enrollment.attendance.length,
      attendedSessions: enrollment.attendance.filter((a) => a.attended).length,
      totalAssessments: enrollment.assessments.length,
    },
    certificateEligibility: eligibility,
  };
};

module.exports = {
  checkCertificateEligibility,
  issueCertificate,
  getProgressReport,
};
