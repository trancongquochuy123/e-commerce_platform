const ApiError = require('../../../utils/apiError.js');
const logger = require('../../../shared/logger.js');
/**
 * Not Found Handler
 */
const notFound = (req, res, next) => {
    const error = new ApiError(404, `Route ${req.originalUrl} not found`);
    next(error);
};

/**
 * Global Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
    let error = err;

    // Convert non-ApiError to ApiError
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || 'Internal Server Error';
        error = new ApiError(statusCode, message, null, false, err.stack);
    }

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
        logger.error('❌ Error Details:');
        logger.error('   Status:', error.statusCode);
        logger.error('   Message:', error.message);
        if (error.errors) {
            logger.error('   Validation Errors:', JSON.stringify(error.errors, null, 2));
        }
        logger.error('   Stack:', error.stack);
    }


    // Response format
    const response = {
        success: false,
        error: {
            code: error.code || 'ERROR',
            message: error.message,
            statusCode: error.statusCode
        },
        timestamp: new Date().toISOString()
    };

    // Add validation errors if present
    if (error.errors) {
        response.error.errors = error.errors;
    }

    // Add stack trace in development
    if (process.env.NODE_ENV === 'development' && error.stack) {
        response.error.stack = error.stack;
    }

    // Send response
    res.status(error.statusCode).json(response);
};

module.exports = {
    errorHandler,
    notFound
};