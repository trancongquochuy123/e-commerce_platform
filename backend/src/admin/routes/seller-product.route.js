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
 * @swagger
 * /admin/seller/products:
 *   get:
 *     summary: Display seller's products
 *     tags:
 *       - Admin Seller Products
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of seller's products
 */
router.get("/", sellerProductController.getMyProducts);

/**
 * @swagger
 * /admin/seller/products/create:
 *   get:
 *     summary: Display create product page
 *     tags:
 *       - Admin Seller Products
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Create product form
 *   post:
 *     summary: Create new seller product
 *     tags:
 *       - Admin Seller Products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
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
 * @swagger
 * /admin/seller/products/detail/{id}:
 *   get:
 *     summary: Display product detail page
 *     tags:
 *       - Admin Seller Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 */
router.get("/detail/:id", sellerProductController.getProductById);

/**
 * @swagger
 * /admin/seller/products/edit/{id}:
 *   get:
 *     summary: Display edit product page
 *     tags:
 *       - Admin Seller Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Edit product form
 *   patch:
 *     summary: Update seller product
 *     tags:
 *       - Admin Seller Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Product updated successfully
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
 * @swagger
 * /admin/seller/products/change-status/{id}:
 *   patch:
 *     summary: Change product status (active/inactive)
 *     tags:
 *       - Admin Seller Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product status changed
 */
router.patch("/change-status/:id", sellerProductController.changeStatus);

/**
 * @swagger
 * /admin/seller/products/delete/{id}:
 *   delete:
 *     summary: Soft delete seller product
 *     tags:
 *       - Admin Seller Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 */
router.delete("/delete/:id", sellerProductController.deleteProduct);

module.exports = router;
