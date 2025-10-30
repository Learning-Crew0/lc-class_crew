const express = require('express');
const router = express.Router();
const { upload, handleUploadError } = require('../../middleware/noticeUpload.middleware');
const noticeBulkController = require('./noticeBulkUpload.controller');

/**
 * @route   POST /api/notices/bulk-upload
 * @desc    Bulk upload notices from CSV or XLSX file
 * @access  Admin (add auth middleware if needed)
 */
router.post(
  '/bulk-upload',
  upload.single('file'),
  handleUploadError,
  noticeBulkController.bulkUploadNotices
);

/**
 * @route   GET /api/notices/bulk-upload/template
 * @desc    Download sample template for bulk upload
 * @query   format=csv
 * @access  Public
 */
router.get(
  '/bulk-upload/template',
  noticeBulkController.getSampleTemplate
);

/**
 * @route   GET /api/notices/bulk-upload/instructions
 * @desc    Get instructions for bulk upload
 * @access  Public
 */
router.get(
  '/bulk-upload/instructions',
  noticeBulkController.getUploadInstructions
);

module.exports = router;

