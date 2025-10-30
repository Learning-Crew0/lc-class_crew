const express = require('express');
const router = express.Router();
const { upload, handleUploadError } = require('../../middleware/reviewUpload.middleware');
const reviewBulkController = require('./reviewBulkUpload.controller');

/**
 * @route   POST /api/reviews/bulk-upload
 * @desc    Bulk upload reviews from CSV or XLSX file
 * @access  Admin (add auth middleware if needed)
 */
router.post(
  '/bulk-upload',
  upload.single('file'),
  handleUploadError,
  reviewBulkController.bulkUploadReviews
);

/**
 * @route   GET /api/reviews/bulk-upload/template
 * @desc    Download sample template for bulk upload
 * @query   format=csv
 * @access  Public
 */
router.get(
  '/bulk-upload/template',
  reviewBulkController.getSampleTemplate
);

/**
 * @route   GET /api/reviews/bulk-upload/instructions
 * @desc    Get instructions for bulk upload
 * @access  Public
 */
router.get(
  '/bulk-upload/instructions',
  reviewBulkController.getUploadInstructions
);

module.exports = router;

