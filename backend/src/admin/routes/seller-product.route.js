const express = require("express");
const router = express.Router();
const multer = require("multer");

// Controllers
const sellerProductController = require("../controllers/seller-product.controller.js");

// Middlewares
const authMiddleware = require("../middlewares/auth.middleware");
const {
  uploadCloudinary,
} = require("../middlewares/uploadCloud.middleware.js");

// Apply Shop role check to all routes
router.use(authMiddleware.requireShopRole);

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
 * @route   GET /admin/seller/products
 * @desc    Display seller's products
 * @access  Private (Shop role)
 */
router.get("/", sellerProductController.getMyProducts);

/**
 * @route   GET /admin/seller/products/create
 * @desc    Display create product page
 * @access  Private (Shop role)
 */
router.get("/create", sellerProductController.renderCreate);

/**
 * @route   POST /admin/seller/products/create
 * @desc    Create new product
 * @access  Private (Shop role)
 */
router.post(
  "/create",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  uploadCloudinary(),
  sellerProductController.createProduct
);

/**
 * @route   GET /admin/seller/products/detail/:id
 * @desc    Display product detail page
 * @access  Private (Shop role)
 */
router.get("/detail/:id", sellerProductController.getProductById);

/**
 * @route   GET /admin/seller/products/edit/:id
 * @desc    Display edit product page
 * @access  Private (Shop role)
 */
router.get("/edit/:id", sellerProductController.renderEdit);

/**
 * @route   PATCH /admin/seller/products/edit/:id
 * @desc    Update product
 * @access  Private (Shop role)
 */
router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloudinary("products/thumbnails"),
  sellerProductController.patchProduct
);

/**
 * @route   PATCH /admin/seller/products/change-status/:id
 * @desc    Change product status (active/inactive)
 * @access  Private (Shop role)
 */
router.patch("/change-status/:id", sellerProductController.changeStatus);

/**
 * @route   DELETE /admin/seller/products/delete/:id
 * @desc    Soft delete product
 * @access  Private (Shop role)
 */
router.delete("/delete/:id", sellerProductController.deleteProduct);

module.exports = router;
