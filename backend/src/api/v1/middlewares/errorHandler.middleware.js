const ApiError = require('../../../utils/apiError.js');

/**
 * Global Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
    let error = err;

    // Convert non-ApiError to ApiError
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || 'Internal Server Error';
        error = new ApiError(statusCode, message, false, err.stack);
    }

    // Response format
    const response = {
        success: false,
        error: {
            code: error.code || 'ERROR',
            message: error.message,
            ...(process.env.NODE_ENV === 'development' && { 
                stack: error.stack 
            })
        },
        timestamp: new Date().toISOString()
    };

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error:', error);
    }

    // Send response
    res.status(error.statusCode).json(response);
};

/**
 * Not Found Handler
 */
const notFound = (req, res, next) => {
    const error = new ApiError(404, `Route ${req.originalUrl} not found`);
    next(error);
};

module.exports = errorHandler;
module.exports.notFound = notFound;