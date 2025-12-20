const express = require("express");
const router = express.Router();
const multer = require("multer");

// Controllers
const productController = require("../controllers/product.controller.js");

// Middlewares
const {
  uploadCloudinary,
} = require("../middlewares/uploadCloud.middleware.js");

// Validators
const productValidator = require("../validators/product.validator.js");

// Multer config (memory storage for Cloudinary)
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

/**
 * @route   GET /admin/products
 * @desc    Display all products page
 * @access  Private (products_view permission)
 */
router.get("/", productController.getAllProducts);

/**
 * @route   GET /admin/products/create
 * @desc    Display create product page
 * @access  Private (products_create permission)
 */
router.get("/create", productController.renderCreate);

/**
 * @route   POST /admin/products/create
 * @desc    Create new product
 * @access  Private (products_create permission)
 */
router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloudinary("products/thumbnails"),
  productValidator.createProduct,
  productController.createProduct
);

/**
 * @route   GET /admin/products/detail/:id
 * @desc    Display product detail page
 * @access  Private (products_view permission)
 */
router.get("/detail/:id", productController.getProductById);

/**
 * @route   GET /admin/products/edit/:id
 * @desc    Display edit product page
 * @access  Private (products_edit permission)
 */
router.get("/edit/:id", productController.renderEdit);

/**
 * @route   PATCH /admin/products/edit/:id
 * @desc    Update product
 * @access  Private (products_edit permission)
 */
router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloudinary("products/thumbnails"),
  productValidator.updateProduct,
  productController.patchProduct
);

/**
 * @route   PATCH /admin/products/change-status/:id
 * @desc    Change product status (active/inactive)
 * @access  Private (products_edit permission)
 */
router.patch(
  "/change-status/:id",
  productValidator.changeStatus,
  productController.changeStatus
);

/**
 * @route   PATCH /admin/products/change-multi
 * @desc    Bulk actions (change status, delete multiple products)
 * @access  Private (products_edit permission)
 */
router.patch(
  "/change-multi",
  productValidator.bulkAction,
  productController.bulkAction
);

/**
 * @route   PATCH /admin/products/change-position/:id
 * @desc    Change product position
 * @access  Private (products_edit permission)
 */
router.patch(
  "/change-position/:id",
  productValidator.changePosition,
  productController.changePosition
);

/**
 * @route   PATCH /admin/products/toggle-feature/:id
 * @desc    Toggle product featured status
 * @access  Private (products_edit permission)
 */
router.patch("/toggle-feature/:id", productController.toggleFeature);

/**
 * @route   DELETE /admin/products/delete/:id
 * @desc    Soft delete product
 * @access  Private (products_delete permission)
 */
router.delete("/delete/:id", productController.deleteProduct);

/**
 * @route   PATCH /admin/products/restore/:id
 * @desc    Restore deleted product
 * @access  Private (products_edit permission)
 */
router.patch("/restore/:id", productController.restoreProduct);

/**
 * @route   DELETE /admin/products/permanent-delete/:id
 * @desc    Permanently delete product
 * @access  Private (products_delete permission + super admin)
 */
router.delete(
  "/permanent-delete/:id",
  productController.permanentDeleteProduct
);

module.exports = router;
