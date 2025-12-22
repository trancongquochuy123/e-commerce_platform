const express = require('express');
const router = express.Router();

const productController = require('../controllers/product.controller');

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Get all products
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: List of all products
 */
router.get('/', productController.getAllProducts);
/**
 * @swagger
 * /api/v1/products/featured:
 *   get:
 *     summary: Get featured products
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: List of featured products
 */
router.get('/featured', productController.getFeaturedProducts);

/**
 * @swagger
 * /api/v1/products/category/{slugCategory}:
 *   get:
 *     summary: Get products by category
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: slugCategory
 *         required: true
 *         schema:
 *           type: string
 *         description: Category slug
 *     responses:
 *       200:
 *         description: Products in the category
 */
router.get('/category/:slugCategory', productController.getProductsByCategory);
/**
 * @swagger
 * /api/v1/products/categories:
 *   get:
 *     summary: Get all product categories
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: List of all categories
 */
router.get('/categories', productController.getAllCategories);

/**
 * @swagger
 * /api/v1/products/{slug}:
 *   get:
 *     summary: Get product by slug
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Product slug
 *     responses:
 *       200:
 *         description: Product details
 */
router.get('/:slug', productController.getProductBySlug);

module.exports = router;