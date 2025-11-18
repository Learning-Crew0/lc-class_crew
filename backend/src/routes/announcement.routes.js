const express = require("express");
const router = express.Router();
const announcementController = require("../controllers/announcement.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validate.middleware");
const {
    createAnnouncementSchema,
    updateAnnouncementSchema,
    getAnnouncementsQuerySchema,
} = require("../validators/announcement.validators");

/**
 * Announcement Routes
 * Base path: /api/v1/announcements
 */

// ============================================
// PUBLIC ROUTES (No authentication required)
// ============================================

/**
 * @route   GET /api/v1/announcements
 * @desc    Get all announcements with pagination
 * @access  Public
 */
router.get(
    "/",
    validate(getAnnouncementsQuerySchema),
    announcementController.getAllAnnouncements
);

/**
 * @route   GET /api/v1/announcements/:id
 * @desc    Get single announcement by ID (increments view count)
 * @access  Public
 */
router.get("/:id", announcementController.getAnnouncementById);

// ============================================
// ADMIN ROUTES (Authentication required)
// ============================================

/**
 * @route   POST /api/v1/announcements
 * @desc    Create new announcement
 * @access  Admin
 */
router.post(
    "/",
    authenticate,
    validate(createAnnouncementSchema),
    announcementController.createAnnouncement
);

/**
 * @route   PUT /api/v1/announcements/:id
 * @desc    Update announcement
 * @access  Admin
 */
router.put(
    "/:id",
    authenticate,
    validate(updateAnnouncementSchema),
    announcementController.updateAnnouncement
);

/**
 * @route   DELETE /api/v1/announcements/:id
 * @desc    Delete announcement
 * @access  Admin
 */
router.delete("/:id", authenticate, announcementController.deleteAnnouncement);

/**
 * @route   GET /api/v1/announcements/stats/overview
 * @desc    Get announcement statistics
 * @access  Admin
 */
router.get("/stats/overview", authenticate, announcementController.getStatistics);

/**
 * @route   PATCH /api/v1/announcements/:id/pin
 * @desc    Toggle pin status
 * @access  Admin
 */
router.patch("/:id/pin", authenticate, announcementController.togglePin);

/**
 * @route   PATCH /api/v1/announcements/:id/active
 * @desc    Toggle active status
 * @access  Admin
 */
router.patch("/:id/active", authenticate, announcementController.toggleActive);

module.exports = router;
