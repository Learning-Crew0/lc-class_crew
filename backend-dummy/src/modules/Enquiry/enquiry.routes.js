const express = require("express");
const router = express.Router();
const enquiryController = require("./enquiry.controller");
const { protect } = require("../../middleware/auth.middleware");
const { protectAdmin } = require("../../middleware/adminAuth.middleware");
const upload = require("../../middlewares/upload");

// ==================== PUBLIC ROUTES ====================

// @route   POST /api/enquiries
// @desc    Create a new enquiry
// @access  Public
router.post(
  "/",
  upload.single("attachment"), // Optional file upload
  enquiryController.createEnquiry
);

// ==================== PROTECTED ROUTES (USER) ====================

// @route   GET /api/enquiries/my-enquiries
// @desc    Get current user's enquiries
// @access  Private
router.get(
  "/my-enquiries",
  protect,
  enquiryController.getMyEnquiries
);

// ==================== ADMIN ROUTES ====================

// @route   GET /api/enquiries/stats
// @desc    Get enquiry statistics
// @access  Private/Admin
router.get(
  "/stats",
  protectAdmin,
  enquiryController.getEnquiryStatistics
);

// @route   GET /api/enquiries
// @desc    Get all enquiries (with filters)
// @access  Private/Admin
router.get(
  "/",
  protectAdmin,
  enquiryController.getAllEnquiries
);

// @route   GET /api/enquiries/:id
// @desc    Get enquiry by ID
// @access  Private (User can only see their own, Admin can see all)
router.get(
  "/:id",
  protect,
  enquiryController.getEnquiryById
);

// @route   PUT /api/enquiries/:id
// @desc    Update enquiry
// @access  Private/Admin
router.put(
  "/:id",
  protectAdmin,
  upload.single("attachment"), // Optional new attachment
  enquiryController.updateEnquiry
);

// @route   PATCH /api/enquiries/:id/status
// @desc    Update enquiry status
// @access  Private/Admin
router.patch(
  "/:id/status",
  protectAdmin,
  enquiryController.updateEnquiryStatus
);

// @route   DELETE /api/enquiries/:id
// @desc    Delete enquiry
// @access  Private/Admin
router.delete(
  "/:id",
  protectAdmin,
  enquiryController.deleteEnquiry
);

module.exports = router;

