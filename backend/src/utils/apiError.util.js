/**
 * Custom API Error class for consistent error handling
 */
class ApiError extends Error {
    constructor(statusCode, message, errors = null, stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors;
        this.success = false;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    // Static factory methods for common errors
    static badRequest(message = "Bad Request", errors = null, extraData = null) {
        const error = new ApiError(400, message, errors);
        if (extraData) {
            Object.assign(error, extraData);
        }
        return error;
    }

    static unauthorized(message = "Unauthorized") {
        return new ApiError(401, message);
    }

    static forbidden(message = "Forbidden") {
        return new ApiError(403, message);
    }

    static notFound(message = "Not Found") {
        return new ApiError(404, message);
    }

    static conflict(message = "Conflict") {
        return new ApiError(409, message);
    }

    static tooManyRequests(message = "Too Many Requests") {
        return new ApiError(429, message);
    }

    static internal(message = "Internal Server Error") {
        return new ApiError(500, message);
    }
}

module.exports = ApiError;
