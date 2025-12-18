const express = require('express');
const router = express.Router();
const multer = require('multer');

// Controllers
const productController = require('../controllers/product.controller.js');

// Middlewares
const { uploadCloudinary } = require('../middlewares/uploadCloud.middleware.js');
const permission = require('../middlewares/permission.middleware.js');

// Validators
const productValidator = require('../validators/product.validator.js');

// Multer config (memory storage for Cloudinary)
const upload = multer({
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
    },
    fileFilter: (req, file, cb) => {
        // Accept images only
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

/**
 * @route   GET /api/v1/admin/products
 * @desc    Get all products with filters
 * @access  Private (products_view permission)
 * @query   ?page=1&limit=20&status=active&keyword=search&category=id
 */
router.get('/', 
    permission.requirePermission('products_view'),
    productController.getAllProducts
);

/**
 * @route   GET /api/v1/admin/products/:id
 * @desc    Get single product details
 * @access  Private (products_view permission)
 */
router.get('/:id',
    permission.requirePermission('products_view'),
    productController.getProductById
);

/**
 * @route   POST /api/v1/admin/products
 * @desc    Create new product
 * @access  Private (products_create permission)
 */
router.post('/',
    permission.requirePermission('products_create'),
    upload.single('thumbnail'),
    uploadCloudinary('products/thumbnails'),
    productValidator.createProduct,
    productController.createProduct
);

/**
 * @route   PUT /api/v1/admin/products/:id
 * @desc    Update product (full update)
 * @access  Private (products_edit permission)
 */
router.put('/:id',
    permission.requirePermission('products_edit'),
    upload.single('thumbnail'),
    uploadCloudinary('products/thumbnails'),
    productValidator.updateProduct,
    productController.updateProduct
);

/**
 * @route   PATCH /api/v1/admin/products/:id
 * @desc    Update product (partial update)
 * @access  Private (products_edit permission)
 */
router.patch('/:id',
    permission.requirePermission('products_edit'),
    upload.single('thumbnail'),
    uploadCloudinary('products/thumbnails'),
    productValidator.updateProduct,
    productController.patchProduct
);

/**
 * @route   PATCH /api/v1/admin/products/:id/status
 * @desc    Change product status (active/inactive)
 * @access  Private (products_edit permission)
 */
router.patch('/:id/status',
    permission.requirePermission('products_edit'),
    productValidator.changeStatus,
    productController.changeStatus
);

/**
 * @route   POST /api/v1/admin/products/bulk-action
 * @desc    Bulk actions (change status, delete multiple products)
 * @access  Private (products_edit permission)
 */
router.post('/bulk-action',
    permission.requirePermission('products_edit'),
    productValidator.bulkAction,
    productController.bulkAction
);

/**
 * @route   PATCH /api/v1/admin/products/:id/position
 * @desc    Change product position
 * @access  Private (products_edit permission)
 */
router.patch('/:id/position',
    permission.requirePermission('products_edit'),
    productValidator.changePosition,
    productController.changePosition
);

/**
 * @route   PATCH /api/v1/admin/products/:id/feature
 * @desc    Toggle product featured status
 * @access  Private (products_edit permission)
 */
router.patch('/:id/feature',
    permission.requirePermission('products_edit'),
    productController.toggleFeature
);

/**
 * @route   DELETE /api/v1/admin/products/:id
 * @desc    Soft delete product
 * @access  Private (products_delete permission)
 */
router.delete('/:id',
    permission.requirePermission('products_delete'),
    productController.deleteProduct
);

/**
 * @route   DELETE /api/v1/admin/products/:id/permanent
 * @desc    Permanently delete product
 * @access  Private (products_delete permission + super admin)
 */
router.delete('/:id/permanent',
    permission.requirePermission('products_delete'),
    permission.isSuperAdmin,
    productController.permanentDeleteProduct
);

/**
 * @route   PATCH /api/v1/admin/products/:id/restore
 * @desc    Restore deleted product
 * @access  Private (products_edit permission)
 */
router.patch('/:id/restore',
    permission.requirePermission('products_edit'),
    productController.restoreProduct
);

// /**
//  * @route   GET /api/v1/admin/products/:id/stock-history
//  * @desc    Get product stock history
//  * @access  Private (products_view permission)
//  */
// router.get('/:id/stock-history',
//     permission.requirePermission('products_view'),
//     productController.getStockHistory
// );

module.exports = router;