/**
 * Response Formatter
 * Chuẩn hóa format response cho API
 */

class ResponseFormatter {
    /**
     * Success Response
     */
    static success(res, data = null, message = 'Success', statusCode = 200, meta = null) {
        const response = {
            success: true,
            message,
            data,
            timestamp: new Date().toISOString()
        };

        // Add metadata if exists (pagination, etc.)
        if (meta) {
            response.meta = meta;
        }

        return res.status(statusCode).json(response);
    }

    /**
     * Created Response (201)
     */
    static created(res, data = null, message = 'Resource created successfully') {
        return this.success(res, data, message, 201);
    }

    /**
     * No Content Response (204)
     */
    static noContent(res) {
        return res.status(204).send();
    }

    /**
     * Paginated Response
     */
    static paginated(res, data, pagination, message = 'Success') {
        const meta = {
            pagination: {
                currentPage: pagination.currentPage,
                totalPages: pagination.totalPages,
                totalItems: pagination.totalItems,
                itemsPerPage: pagination.limit,
                hasNextPage: pagination.currentPage < pagination.totalPages,
                hasPrevPage: pagination.currentPage > 1
            }
        };

        return this.success(res, data, message, 200, meta);
    }

    /**
     * Error Response
     */
    static error(res, message = 'Error', statusCode = 500, code = 'ERROR', errors = null) {
        const response = {
            success: false,
            error: {
                code,
                message,
                ...(errors && { details: errors })
            },
            timestamp: new Date().toISOString()
        };

        return res.status(statusCode).json(response);
    }

    /**
     * Validation Error Response
     */
    static validationError(res, errors) {
        return this.error(
            res,
            'Validation failed',
            422,
            'VALIDATION_ERROR',
            errors
        );
    }
}

module.exports = ResponseFormatter;