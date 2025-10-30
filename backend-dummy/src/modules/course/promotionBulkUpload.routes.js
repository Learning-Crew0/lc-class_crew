const express = require('express');
const router = express.Router();
const { upload, handleUploadError } = require('../../middleware/promotionUpload.middleware');
const promotionBulkController = require('./promotionBulkUpload.controller');

/**
 * @route   POST /api/promotions/bulk-upload
 * @desc    Bulk upload promotions from CSV or XLSX file
 * @access  Admin (add auth middleware if needed)
 */
router.post(
  '/bulk-upload',
  upload.single('file'),
  handleUploadError,
  promotionBulkController.bulkUploadPromotions
);

/**
 * @route   GET /api/promotions/bulk-upload/template
 * @desc    Download sample template for bulk upload
 * @query   format=csv
 * @access  Public
 */
router.get(
  '/bulk-upload/template',
  promotionBulkController.getSampleTemplate
);

/**
 * @route   GET /api/promotions/bulk-upload/instructions
 * @desc    Get instructions for bulk upload
 * @access  Public
 */
router.get(
  '/bulk-upload/instructions',
  promotionBulkController.getUploadInstructions
);

module.exports = router;

