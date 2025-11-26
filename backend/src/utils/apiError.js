/**
 * Custom API Error Class
 * Để handle error một cách thống nhất
 */
class ApiError extends Error {
    constructor(statusCode, message, code = null, isOperational = true, stack = '') {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = isOperational;
        
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    // Common error factories
    static badRequest(message = 'Bad Request', code = 'BAD_REQUEST') {
        return new ApiError(400, message, code);
    }

    static unauthorized(message = 'Unauthorized', code = 'UNAUTHORIZED') {
        return new ApiError(401, message, code);
    }

    static forbidden(message = 'Forbidden', code = 'FORBIDDEN') {
        return new ApiError(403, message, code);
    }

    static notFound(message = 'Not Found', code = 'NOT_FOUND') {
        return new ApiError(404, message, code);
    }

    static conflict(message = 'Conflict', code = 'CONFLICT') {
        return new ApiError(409, message, code);
    }

    static unprocessable(message = 'Unprocessable Entity', code = 'UNPROCESSABLE_ENTITY') {
        return new ApiError(422, message, code);
    }

    static tooManyRequests(message = 'Too Many Requests', code = 'TOO_MANY_REQUESTS') {
        return new ApiError(429, message, code);
    }

    static internal(message = 'Internal Server Error', code = 'INTERNAL_ERROR') {
        return new ApiError(500, message, code);
    }
}

module.exports = ApiError;