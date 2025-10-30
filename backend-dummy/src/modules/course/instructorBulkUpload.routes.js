const express = require('express');
const router = express.Router();
const { upload, handleUploadError } = require('../../middleware/instructorUpload.middleware');
const instructorBulkController = require('./instructorBulkUpload.controller');

/**
 * @route   POST /api/instructors/bulk-upload
 * @desc    Bulk upload instructors from CSV or XLSX file
 * @access  Admin (add auth middleware if needed)
 */
router.post(
  '/bulk-upload',
  upload.single('file'),
  handleUploadError,
  instructorBulkController.bulkUploadInstructors
);

/**
 * @route   GET /api/instructors/bulk-upload/template
 * @desc    Download sample template for bulk upload
 * @query   format=csv
 * @access  Public
 */
router.get(
  '/bulk-upload/template',
  instructorBulkController.getSampleTemplate
);

/**
 * @route   GET /api/instructors/bulk-upload/instructions
 * @desc    Get instructions for bulk upload
 * @access  Public
 */
router.get(
  '/bulk-upload/instructions',
  instructorBulkController.getUploadInstructions
);

module.exports = router;

