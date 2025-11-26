const express = require('express');
const router = express.Router();
const multer = require('multer');

// Controllers
const productController = require('../../controllers/admin/product.controller.js');

// Middlewares
const { uploadCloudinary } = require('../../middlewares/admin/uploadCloud.middleware.js');
const permission = require('../../middlewares/admin/permission.middleware.js');

// Validators
const productValidator = require('../../validators/admin/product.validator.js');

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
 * @access  Private (product_view permission)
 * @query   ?page=1&limit=20&status=active&keyword=search&category=id
 */
router.get('/', 
    permission.requirePermission('product_view'),
    productController.getAllProducts
);

/**
 * @route   GET /api/v1/admin/products/:id
 * @desc    Get single product details
 * @access  Private (product_view permission)
 */
router.get('/:id',
    permission.requirePermission('product_view'),
    productController.getProductById
);

/**
 * @route   POST /api/v1/admin/products
 * @desc    Create new product
 * @access  Private (product_create permission)
 */
router.post('/',
    permission.requirePermission('product_create'),
    upload.single('thumbnail'),
    uploadCloudinary('products/thumbnails'),
    productValidator.createProduct,
    productController.createProduct
);

/**
 * @route   PUT /api/v1/admin/products/:id
 * @desc    Update product (full update)
 * @access  Private (product_edit permission)
 */
router.put('/:id',
    permission.requirePermission('product_edit'),
    upload.single('thumbnail'),
    uploadCloudinary('products/thumbnails'),
    productValidator.updateProduct,
    productController.updateProduct
);

/**
 * @route   PATCH /api/v1/admin/products/:id
 * @desc    Update product (partial update)
 * @access  Private (product_edit permission)
 */
router.patch('/:id',
    permission.requirePermission('product_edit'),
    upload.single('thumbnail'),
    uploadCloudinary('products/thumbnails'),
    productValidator.updateProduct,
    productController.patchProduct
);

/**
 * @route   PATCH /api/v1/admin/products/:id/status
 * @desc    Change product status (active/inactive)
 * @access  Private (product_edit permission)
 */
router.patch('/:id/status',
    permission.requirePermission('product_edit'),
    productValidator.changeStatus,
    productController.changeStatus
);

/**
 * @route   POST /api/v1/admin/products/bulk-action
 * @desc    Bulk actions (change status, delete multiple products)
 * @access  Private (product_edit permission)
 */
router.post('/bulk-action',
    permission.requirePermission('product_edit'),
    productValidator.bulkAction,
    productController.bulkAction
);

/**
 * @route   PATCH /api/v1/admin/products/:id/position
 * @desc    Change product position
 * @access  Private (product_edit permission)
 */
router.patch('/:id/position',
    permission.requirePermission('product_edit'),
    productValidator.changePosition,
    productController.changePosition
);

/**
 * @route   PATCH /api/v1/admin/products/:id/feature
 * @desc    Toggle product featured status
 * @access  Private (product_edit permission)
 */
router.patch('/:id/feature',
    permission.requirePermission('product_edit'),
    productController.toggleFeature
);

/**
 * @route   DELETE /api/v1/admin/products/:id
 * @desc    Soft delete product
 * @access  Private (product_delete permission)
 */
router.delete('/:id',
    permission.requirePermission('product_delete'),
    productController.deleteProduct
);

/**
 * @route   DELETE /api/v1/admin/products/:id/permanent
 * @desc    Permanently delete product
 * @access  Private (product_delete permission + super admin)
 */
router.delete('/:id/permanent',
    permission.requirePermission('product_delete'),
    permission.isSuperAdmin,
    productController.permanentDeleteProduct
);

/**
 * @route   PATCH /api/v1/admin/products/:id/restore
 * @desc    Restore deleted product
 * @access  Private (product_edit permission)
 */
router.patch('/:id/restore',
    permission.requirePermission('product_edit'),
    productController.restoreProduct
);

// /**
//  * @route   GET /api/v1/admin/products/:id/stock-history
//  * @desc    Get product stock history
//  * @access  Private (product_view permission)
//  */
// router.get('/:id/stock-history',
//     permission.requirePermission('product_view'),
//     productController.getStockHistory
// );

module.exports = router;