/**
 * Send success response
 */
const successResponse = (
  res,
  data = null,
  message = "Success",
  statusCode = 200
) => {
  const response = {
    status: "success",
    message,
    data,
  };

  return res.status(statusCode).json(response);
};

/**
 * Send error response
 */
const errorResponse = (
  res,
  message = "Error",
  statusCode = 500,
  errors = null
) => {
  const response = {
    status: "error",
    message,
    ...(errors && { errors }),
  };

  return res.status(statusCode).json(response);
};

/**
 * Send paginated response
 */
const paginatedResponse = (res, data, pagination, message = "Success") => {
  const response = {
    status: "success",
    message,
    data,
    pagination,
  };

  return res.status(200).json(response);
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse,
};
