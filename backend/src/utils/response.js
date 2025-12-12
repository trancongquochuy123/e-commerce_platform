/**
 * Response Formatter (response.js)
 * Chuẩn hóa format response cho API
 */

class ResponseFormatter {
    /**
     * Success Response
     * @param {object} res - Express response object
     * @param {any} [data=null] - Dữ liệu trả về
     * @param {string} [message='Success'] - Thông báo
     * @param {number} [statusCode=200] - Mã trạng thái HTTP
     * @param {object} [meta=null] - Metadata (pagination,...)
     */
    static success(res, data = null, message = 'Success', statusCode = 200, meta = null) {
        const response = {
            success: true,
            message,
            data,
            timestamp: new Date().toISOString()
        };

        // Thêm metadata nếu có
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
     * Error Response - Chỉ dùng cho Express Error Handler
     * (Thường không gọi trực tiếp trong controller mà là từ error middleware)
     * @param {object} res - Express response object
     * @param {string} [message='Error'] - Thông báo lỗi
     * @param {number} [statusCode=500] - Mã trạng thái HTTP
     * @param {string} [code='ERROR'] - Mã lỗi nội bộ
     * @param {any} [errors=null] - Chi tiết lỗi
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
     * Validation Error Response (422)
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