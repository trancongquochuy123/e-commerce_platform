const express = require('express');
const router = express.Router();

const productController = require('../controllers/product.controller');

router.get('/', productController.getAllProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/category/:slugCategory', productController.getProductsByCategory);
router.get('/categories', productController.getAllCategories);
router.get('/:slug', productController.getProductBySlug);

module.exports = router;