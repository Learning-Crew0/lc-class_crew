const uploadService = require("../services/upload.service");
const { successResponse } = require("../utils/response.util");

/**
 * Upload single file
 */
const uploadSingle = async (req, res, next) => {
  try {
    const file = await uploadService.processUpload(req.file);
    return successResponse(res, file, "File uploaded successfully", 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Upload multiple files
 */
const uploadMultiple = async (req, res, next) => {
  try {
    const files = await uploadService.processMultipleUploads(req.files);
    return successResponse(res, files, "Files uploaded successfully", 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete file
 */
const deleteFile = async (req, res, next) => {
  try {
    const result = await uploadService.deleteFile(req.params.filename);
    return successResponse(res, result, "File deleted successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Get file info
 */
const getFileInfo = async (req, res, next) => {
  try {
    const fileInfo = await uploadService.getFileInfo(req.params.filename);
    return successResponse(res, fileInfo, "File info retrieved successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  deleteFile,
  getFileInfo,
};
