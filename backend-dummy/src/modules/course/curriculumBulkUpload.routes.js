const express = require('express');
const router = express.Router();
const { upload, handleUploadError } = require('../../middleware/curicullumUpload.middleware');
const curriculumBulkController = require('./curriculumBulkUpload.controller');

/**
 * @route   POST /api/curriculums/bulk-upload
 * @desc    Bulk upload curriculums from CSV or XLSX file
 * @access  Admin (add auth middleware if needed)
 */
router.post(
  '/bulk-upload',
  upload.single('file'),
  handleUploadError,
  curriculumBulkController.bulkUploadCurriculums
);

/**
 * @route   GET /api/curriculums/bulk-upload/template
 * @desc    Download sample template for bulk upload
 * @query   format=csv
 * @access  Public
 */
router.get(
  '/bulk-upload/template',
  curriculumBulkController.getSampleTemplate
);

/**
 * @route   GET /api/curriculums/bulk-upload/instructions
 * @desc    Get instructions for bulk upload
 * @access  Public
 */
router.get(
  '/bulk-upload/instructions',
  curriculumBulkController.getUploadInstructions
);

module.exports = router;

