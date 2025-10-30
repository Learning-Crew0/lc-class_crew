const express = require('express');
const router = express.Router();
const { upload, handleUploadError } = require('../../middleware/categoryUpload.middleware');
const categoryBulkController = require('./categoryBulkUpload.controller');

/**
 * @route   POST /api/categories/bulk-upload
 * @desc    Bulk upload categories from CSV or XLSX file
 * @access  Admin (add auth middleware if needed)
 */
router.post(
  '/bulk-upload',
  upload.single('file'),
  handleUploadError,
  categoryBulkController.bulkUploadCategories
);

/**
 * @route   GET /api/categories/bulk-upload/template
 * @desc    Download sample template for bulk upload
 * @query   format=csv or format=xlsx
 * @access  Public
 */
router.get(
  '/bulk-upload/template',
  categoryBulkController.getSampleTemplate
);

/**
 * @route   GET /api/categories/bulk-upload/instructions
 * @desc    Get instructions for bulk upload
 * @access  Public
 */
router.get(
  '/bulk-upload/instructions',
  categoryBulkController.getUploadInstructions
);

module.exports = router;

