const { body, param, query, validationResult } = require('express-validator');
const ApiError = require('../../../../utils/apiError.js');

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(err => ({
            field: err.path || err.param,
            message: err.msg,
            value: err.value
        }));
        
        return next(new ApiError(422, 'Validation failed', formattedErrors));
    }
    next();
};

/**
 * Validate create product
 */
const createProduct = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 8, max: 200 }).withMessage('Title must be between 8 and 200 characters'),
    
    body('price')
        .notEmpty().withMessage('Price is required')
        .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    
    body('discountPercentage')
        .optional()
        .isFloat({ min: 0, max: 100 }).withMessage('Discount must be between 0 and 100'),
    
    body('stock')
        .notEmpty().withMessage('Stock is required')
        .isInt({ min: 0 }).withMessage('Stock must be a positive integer'),
    
    body('product_category_id')
        .optional()
        .isMongoId().withMessage('Invalid category ID'),
    
    body('description')
        .optional()
        .isLength({ max: 10000 }).withMessage('Description too long (max 10000 characters)'),
    
    body('brand')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('Brand name too long'),
    
    body('sku')
        .optional()
        .trim()
        .isLength({ max: 50 }).withMessage('SKU too long'),
    
    body('weight')
        .optional()
        .isFloat({ min: 0 }).withMessage('Weight must be positive'),
    
    body('dimensions.width')
        .optional()
        .isFloat({ min: 0 }).withMessage('Width must be positive'),
    
    body('dimensions.height')
        .optional()
        .isFloat({ min: 0 }).withMessage('Height must be positive'),
    
    body('dimensions.depth')
        .optional()
        .isFloat({ min: 0 }).withMessage('Depth must be positive'),
    
    body('status')
        .optional()
        .isIn(['active', 'inactive']).withMessage('Status must be active or inactive'),
    
    body('feature')
        .optional()
        .isIn(['0', '1']).withMessage('Feature must be 0 or 1'),
    
    body('tags')
        .optional()
        .isArray().withMessage('Tags must be an array'),
    
    handleValidationErrors
];

/**
 * Validate update product
 */
const updateProduct = [
    param('id')
        .isMongoId().withMessage('Invalid product ID'),
    
    body('title')
        .optional()
        .trim()
        .isLength({ min: 8, max: 200 }).withMessage('Title must be between 8 and 200 characters'),
    
    body('price')
        .optional()
        .isFloat({ min: 0 }).withMessage('Price must be positive'),
    
    body('discountPercentage')
        .optional()
        .isFloat({ min: 0, max: 100 }).withMessage('Discount must be between 0 and 100'),
    
    body('stock')
        .optional()
        .isInt({ min: 0 }).withMessage('Stock must be positive'),
    
    body('product_category_id')
        .optional()
        .isMongoId().withMessage('Invalid category ID'),
    
    body('status')
        .optional()
        .isIn(['active', 'inactive']).withMessage('Invalid status'),
    
    body('feature')
        .optional()
        .isIn(['0', '1']).withMessage('Invalid feature value'),
    
    handleValidationErrors
];

/**
 * Validate change status
 */
const changeStatus = [
    param('id')
        .isMongoId().withMessage('Invalid product ID'),
    
    body('status')
        .notEmpty().withMessage('Status is required')
        .isIn(['active', 'inactive']).withMessage('Status must be active or inactive'),
    
    handleValidationErrors
];

/**
 * Validate bulk action
 */
const bulkAction = [
    body('action')
        .notEmpty().withMessage('Action is required')
        .isIn(['delete', 'active', 'inactive', 'feature', 'unfeature'])
        .withMessage('Invalid action'),
    
    body('ids')
        .notEmpty().withMessage('Product IDs are required')
        .isArray({ min: 1 }).withMessage('IDs must be a non-empty array')
        .custom((ids) => {
            return ids.every(id => /^[0-9a-fA-F]{24}$/.test(id));
        }).withMessage('All IDs must be valid MongoDB ObjectIds'),
    
    handleValidationErrors
];

/**
 * Validate change position
 */
const changePosition = [
    param('id')
        .isMongoId().withMessage('Invalid product ID'),
    
    body('position')
        .notEmpty().withMessage('Position is required')
        .isInt({ min: 1 }).withMessage('Position must be a positive integer'),
    
    handleValidationErrors
];

/**
 * Validate query parameters for listing
 */
const queryParams = [
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    
    query('status')
        .optional()
        .isIn(['active', 'inactive', 'all']).withMessage('Invalid status filter'),
    
    query('feature')
        .optional()
        .isIn(['0', '1', 'all']).withMessage('Invalid feature filter'),
    
    query('category')
        .optional()
        .isMongoId().withMessage('Invalid category ID'),
    
    query('sortBy')
        .optional()
        .isIn(['createdAt', 'updatedAt', 'title', 'price', 'stock', 'position'])
        .withMessage('Invalid sort field'),
    
    query('order')
        .optional()
        .isIn(['asc', 'desc']).withMessage('Order must be asc or desc'),
    
    handleValidationErrors
];

// Export all validators
module.exports = {
    createProduct,
    updateProduct,
    changeStatus,
    bulkAction,
    changePosition,
    queryParams
};