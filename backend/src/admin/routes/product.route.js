const express = require("express");
const router = express.Router();
const multer = require('multer');
// const storageMulter = require('../../helper/storageMulter.js');
const { uploadCloudinary } = require('../middlewares/uploadCloud.middleware.js');

const upload = multer();

const controller = require('../controllers/product.controller');

const validate = require('../validators/product.validator');

/**
 * @swagger
 * /admin/products:
 *   get:
 *     summary: Get all products (admin)
 *     tags:
 *       - Admin Products
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of products
 */
router.get("/", controller.index);

/**
 * @swagger
 * /admin/products/change-status/{status}/{id}:
 *   patch:
 *     summary: Change product status
 *     tags:
 *       - Admin Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status changed
 */
router.patch("/change-status/:status/:id", controller.changeStatus);

/**
 * @swagger
 * /admin/products/change-multi:
 *   patch:
 *     summary: Change multiple products status
 *     tags:
 *       - Admin Products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Statuses changed
 */
router.patch("/change-multi/", controller.changeMulti);

/**
 * @swagger
 * /admin/products/delete/{id}:
 *   delete:
 *     summary: Delete product
 *     tags:
 *       - Admin Products
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
 *         description: Product deleted
 */
router.delete("/delete/:id", controller.deleteItem);

/**
 * @swagger
 * /admin/products/create:
 *   get:
 *     summary: Get product creation form
 *     tags:
 *       - Admin Products
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Creation form
 *   post:
 *     summary: Create new product
 *     tags:
 *       - Admin Products
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
 *     responses:
 *       200:
 *         description: Product created
 */
router.get("/create", controller.create);

// Multer
router.post('/create',
    upload.single('thumbnail'),
    uploadCloudinary('products/thumbnails'), 
    validate.createProduct,
    controller.createProduct
);

/**
 * @swagger
 * /admin/products/edit/{id}:
 *   get:
 *     summary: Get product edit form
 *     tags:
 *       - Admin Products
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
 *     summary: Update product
 *     tags:
 *       - Admin Products
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
 *         description: Product updated
 */
router.get("/edit/:id", controller.edit);

router.patch("/edit/:id",
    upload.single('thumbnail'),
    uploadCloudinary('products/thumbnails'),
    validate.createProduct,
    controller.editPatch
);

/**
 * @swagger
 * /admin/products/detail/{id}:
 *   get:
 *     summary: Get product details
 *     tags:
 *       - Admin Products
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
 *         description: Product details
 */
router.get("/detail/:id",
    controller.detail,
);


module.exports = router;
