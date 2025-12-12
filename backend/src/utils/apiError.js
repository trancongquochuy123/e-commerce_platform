/**
 * Custom API Error Class
 */
class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @param {array|object} errors - Validation errors (optional)
   * @param {boolean} isOperational - Is error operational or programming error
   * @param {string} stack - Stack trace
   */
  constructor(
    statusCode,
    message,
    errors = null,
    isOperational = true,
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors; // For validation errors
    this.isOperational = isOperational;

    // Error codes for better client handling
    this.code = this.getErrorCode(statusCode);

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Get error code based on status code
   */
  getErrorCode(statusCode) {
    const errorCodes = {
      400: "BAD_REQUEST",
      401: "UNAUTHORIZED",
      403: "FORBIDDEN",
      404: "NOT_FOUND",
      409: "CONFLICT",
      422: "VALIDATION_ERROR",
      429: "TOO_MANY_REQUESTS",
      500: "INTERNAL_SERVER_ERROR",
      502: "BAD_GATEWAY",
      503: "SERVICE_UNAVAILABLE",
    };

    return errorCodes[statusCode] || "ERROR";
  }

  /**
   * Convert error to JSON format for API response
   */
  toJSON() {
    const error = {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
    };

    // Include validation errors if present
    if (this.errors) {
      error.errors = this.errors;
    }

    // Include stack trace in development
    if (process.env.NODE_ENV === "development") {
      error.stack = this.stack;
    }

    return error;
  }
}

module.exports = ApiError;
