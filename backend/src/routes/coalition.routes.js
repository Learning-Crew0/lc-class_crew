const express = require("express");
const router = express.Router();
const coalitionController = require("../controllers/coalition.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const requireAdmin = require("../middlewares/admin.middleware");
const { coalitionUploads } = require("../middlewares/upload.middleware");
const { validate } = require("../middlewares/validate.middleware");
const {
    updateStatusSchema,
    getCoalitionsQuerySchema,
} = require("../validators/coalition.validators");

/**
 * Public routes
 */

/**
 * @route   POST /api/v1/coalitions
 * @desc    Submit a coalition application (public)
 * @access  Public
 */
router.post("/", coalitionUploads, coalitionController.createCoalition);

/**
 * Admin routes (require authentication and admin role)
 */

/**
 * @route   GET /api/v1/coalitions/stats
 * @desc    Get coalition statistics
 * @access  Private/Admin
 * @note    This route must come BEFORE /:id to avoid conflicts
 */
router.get(
    "/stats",
    authenticate,
    requireAdmin,
    coalitionController.getCoalitionStats
);

/**
 * @route   GET /api/v1/coalitions
 * @desc    Get all coalition applications with pagination and filtering
 * @access  Private/Admin
 */
router.get(
    "/",
    authenticate,
    requireAdmin,
    validate(getCoalitionsQuerySchema, "query"),
    coalitionController.getAllCoalitions
);

/**
 * @route   GET /api/v1/coalitions/:id
 * @desc    Get single coalition application by ID
 * @access  Private/Admin
 */
router.get(
    "/:id",
    authenticate,
    requireAdmin,
    coalitionController.getCoalitionById
);

/**
 * @route   PATCH /api/v1/coalitions/:id/status
 * @desc    Update coalition application status
 * @access  Private/Admin
 */
router.patch(
    "/:id/status",
    authenticate,
    requireAdmin,
    validate(updateStatusSchema),
    coalitionController.updateCoalitionStatus
);

/**
 * @route   DELETE /api/v1/coalitions/:id
 * @desc    Delete coalition application
 * @access  Private/Admin
 */
router.delete(
    "/:id",
    authenticate,
    requireAdmin,
    coalitionController.deleteCoalition
);

module.exports = router;
