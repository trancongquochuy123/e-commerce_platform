const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const {uploadCloudinary} = require('../middlewares/uploadCloud.middleware.js');
const controller = require('../controllers/product-category.controller.js');
const validate = require('../validators/product-category.validator.js');

/**
 * @swagger
 * /admin/products-category:
 *   get:
 *     summary: Get all product categories (admin)
 *     tags:
 *       - Admin Categories
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get("/", controller.index);

/**
 * @swagger
 * /admin/products-category/create:
 *   get:
 *     summary: Get category creation form
 *     tags:
 *       - Admin Categories
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Creation form
 *   post:
 *     summary: Create new category
 *     tags:
 *       - Admin Categories
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Category created
 */
router.get("/create", controller.create);

/**
 * @swagger
 * /admin/products-category/delete/{id}:
 *   delete:
 *     summary: Delete category
 *     tags:
 *       - Admin Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted
 */
router.delete("/delete/:id", controller.deleteItem);

// Multer
router.post('/create',
    upload.single('thumbnail'),
    uploadCloudinary('products-category/thumbnails'),
    validate.createProduct,
    controller.createProduct,
);

/**
 * @swagger
 * /admin/products-category/edit/{id}:
 *   get:
 *     summary: Get category edit form
 *     tags:
 *       - Admin Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Edit form
 *   patch:
 *     summary: Update category
 *     tags:
 *       - Admin Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Category updated
 */
router.get("/edit/:id", controller.edit);

router.patch("/edit/:id",
    upload.single('thumbnail'),
    uploadCloudinary('products-category/thumbnails'),
    validate.createProduct,
    controller.editPatch
);

/**
 * @swagger
 * /admin/products-category/detail/{id}:
 *   get:
 *     summary: Get category details
 *     tags:
 *       - Admin Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category details
 */
router.get("/detail/:id",
    controller.detail,
);

module.exports = router;