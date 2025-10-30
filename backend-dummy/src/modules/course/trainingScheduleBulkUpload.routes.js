const express = require('express');
const router = express.Router();
const { upload, handleUploadError } = require('../../middleware/trainingScheduleUpload.middleware');
const trainingScheduleBulkController = require('./trainingScheduleBulkUpload.controller');

/**
 * @route   POST /api/training-schedules/bulk-upload
 * @desc    Bulk upload training schedules from CSV or XLSX file
 * @access  Admin (add auth middleware if needed)
 */
router.post(
  '/bulk-upload',
  upload.single('file'),
  handleUploadError,
  trainingScheduleBulkController.bulkUploadTrainingSchedules
);

/**
 * @route   GET /api/training-schedules/bulk-upload/template
 * @desc    Download sample template for bulk upload
 * @query   format=csv
 * @access  Public
 */
router.get(
  '/bulk-upload/template',
  trainingScheduleBulkController.getSampleTemplate
);

/**
 * @route   GET /api/training-schedules/bulk-upload/instructions
 * @desc    Get instructions for bulk upload
 * @access  Public
 */
router.get(
  '/bulk-upload/instructions',
  trainingScheduleBulkController.getUploadInstructions
);

module.exports = router;

