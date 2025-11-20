const express = require("express");
const router = express.Router();
const trainingScheduleController = require("../controllers/trainingSchedule.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const requireAdmin = require("../middlewares/admin.middleware");
const multer = require("multer");
const path = require("path");

// Configure multer for Excel file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../uploads/temp"));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `schedule-upload-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-excel",
        ];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only Excel files (.xlsx, .xls) are allowed"));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});

// ========================================
// PUBLIC ROUTES
// ========================================

/**
 * Get all training schedules for calendar view
 * GET /api/v1/training-schedules/calendar
 * Query params: startDate, endDate, status, categorySlug, isActive
 */
router.get("/calendar", trainingScheduleController.getCalendarSchedules);

// ========================================
// ADMIN ROUTES
// ========================================

/**
 * Export annual schedule to Excel and/or PDF
 * POST /api/v1/training-schedules/export/annual
 * Body: { year: 2025, format: "both" | "excel" | "pdf" }
 */
router.post(
    "/export/annual",
    authenticate,
    requireAdmin,
    trainingScheduleController.exportAnnualSchedule
);

/**
 * Download bulk upload template
 * GET /api/v1/training-schedules/bulk-upload/template
 */
router.get(
    "/bulk-upload/template",
    authenticate,
    requireAdmin,
    trainingScheduleController.downloadBulkUploadTemplate
);

/**
 * Bulk upload training schedules from Excel
 * POST /api/v1/training-schedules/bulk-upload
 * Body: multipart/form-data with "file" field
 */
router.post(
    "/bulk-upload",
    authenticate,
    requireAdmin,
    upload.single("file"),
    trainingScheduleController.bulkUploadSchedules
);

module.exports = router;

