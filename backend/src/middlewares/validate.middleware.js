const { errorResponse } = require("../utils/response.util");

/**
 * Validate request using Joi schema
 */
const validate = (schema) => {
  return (req, res, next) => {
    const validationOptions = {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    };

    const { error, value } = schema.validate(req.body, validationOptions);

    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return errorResponse(res, "Validation error", 400, errors);
    }

    // Replace req.body with validated value
    req.body = value;
    next();
  };
};

/**
 * Validate query parameters
 */
const validateQuery = (schema) => {
  return (req, res, next) => {
    const validationOptions = {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    };

    const { error, value } = schema.validate(req.query, validationOptions);

    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return errorResponse(res, "Validation error", 400, errors);
    }

    req.query = value;
    next();
  };
};

/**
 * Validate route parameters
 */
const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params);

    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return errorResponse(res, "Validation error", 400, errors);
    }

    req.params = value;
    next();
  };
};

module.exports = {
  validate,
  validateQuery,
  validateParams,
};
