const express = require('express');
const router = express.Router();
const { upload, handleUploadError } = require('../../middleware/courseUpload.middleware');
const courseBulkController = require('./courseBulkUpload.controller');

/**
 * @route   POST /api/courses/bulk-upload
 * @desc    Bulk upload courses from CSV or XLSX file
 * @access  Admin (add auth middleware if needed)
 */
router.post(
  '/bulk-upload',
  upload.single('file'),
  handleUploadError,
  courseBulkController.bulkUploadCourses
);

/**
 * @route   GET /api/courses/bulk-upload/template
 * @desc    Download sample template for bulk upload
 * @query   format=csv
 * @access  Public
 */
router.get(
  '/bulk-upload/template',
  courseBulkController.getSampleTemplate
);

/**
 * @route   GET /api/courses/bulk-upload/instructions
 * @desc    Get instructions for bulk upload
 * @access  Public
 */
router.get(
  '/bulk-upload/instructions',
  courseBulkController.getUploadInstructions
);

module.exports = router;


