const logger = require("../config/logger");
const config = require("../config/env");
const ApiError = require("../utils/apiError.util");

/**
 * Central error handling middleware
 */
const errorMiddleware = (err, req, res, next) => {
  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    statusCode: err.statusCode,
  });

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    err = ApiError.badRequest("Validation error", errors);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    err = ApiError.conflict(`${field} already exists`);
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === "CastError") {
    err = ApiError.badRequest("Invalid ID format");
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    err = ApiError.unauthorized("Invalid token");
  }

  if (err.name === "TokenExpiredError") {
    err = ApiError.unauthorized("Token expired");
  }

  // Multer file upload errors
  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      err = ApiError.badRequest("File size too large");
    } else {
      err = ApiError.badRequest("File upload error");
    }
  }

  // If not an ApiError, convert to internal server error
  if (!(err instanceof ApiError)) {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";
    err = new ApiError(statusCode, message);
  }

  // Send error response
  const response = {
    success: false,
    message: err.message,
    ...(err.errors && { errors: err.errors }),
    ...(config.env === "development" && { stack: err.stack }),
  };

  res.status(err.statusCode).json(response);
};

module.exports = errorMiddleware;
