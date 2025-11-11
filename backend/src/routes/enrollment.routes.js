const express = require("express");
const router = express.Router();
const studentEnrollmentController = require("../controllers/studentEnrollment.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const requireAdmin = require("../middlewares/admin.middleware");

/**
 * All enrollment routes require authentication
 */
router.use(authenticate);

/**
 * Student routes
 */

// Get student's enrollments
router.get(
    "/student/:userId",
    studentEnrollmentController.getStudentEnrollments
);

// Get enrollment by ID
router.get("/:enrollmentId", studentEnrollmentController.getEnrollmentById);

// Cancel enrollment
router.post(
    "/:enrollmentId/cancel",
    studentEnrollmentController.cancelEnrollment
);

/**
 * Admin routes
 */

// Add attendance record
router.post(
    "/:enrollmentId/attendance",
    requireAdmin,
    studentEnrollmentController.addAttendanceRecord
);

// Mark enrollment as completed
router.post(
    "/:enrollmentId/complete",
    requireAdmin,
    studentEnrollmentController.completeEnrollment
);

// Issue certificate
router.post(
    "/:enrollmentId/certificate",
    requireAdmin,
    studentEnrollmentController.issueCertificate
);

// Get course enrollment statistics
router.get(
    "/stats/course/:courseId",
    requireAdmin,
    studentEnrollmentController.getCourseEnrollmentStats
);

module.exports = router;
