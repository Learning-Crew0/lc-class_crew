const express = require("express");
const router = express.Router();
const classApplicationController = require("../controllers/classApplication.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { classApplicationUploads } = require("../middlewares/upload.middleware");

/**
 * Public routes
 */

// Download bulk upload template
router.get(
    "/download-template",
    classApplicationController.downloadTemplate
);

/**
 * Private routes (require authentication)
 */
router.use(authenticate);

// Create draft application
router.post(
    "/draft",
    classApplicationController.createDraftApplication
);

// Validate student credentials
router.post(
    "/validate-student",
    classApplicationController.validateStudent
);

// Get application by ID
router.get(
    "/:applicationId",
    classApplicationController.getApplicationById
);

// Add student to course
router.post(
    "/:applicationId/add-student",
    classApplicationController.addStudentToCourse
);

// Upload bulk students file
router.post(
    "/:applicationId/upload-bulk-students",
    classApplicationUploads,
    classApplicationController.uploadBulkStudents
);

// Update payment information
router.put(
    "/:applicationId/payment",
    classApplicationController.updatePaymentInfo
);

// Submit application
router.post(
    "/:applicationId/submit",
    classApplicationController.submitApplication
);

// Get user's applications
router.get(
    "/user/:userId",
    classApplicationController.getUserApplications
);

// Cancel application
router.post(
    "/:applicationId/cancel",
    classApplicationController.cancelApplication
);

module.exports = router;
