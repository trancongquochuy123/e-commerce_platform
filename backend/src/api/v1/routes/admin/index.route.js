// src/api/v1/routes/admin/index.js
const express = require('express');
const router = express.Router();

// Admin route modules
router.use('/dashboard', require('./dashboard.route'));
router.use('/products', require('./product.route'));
router.use('/products-category', require('./product-category.route'));
router.use('/roles', require('./role.route'));
router.use('/accounts', require('./account.route'));
router.use('/auth', require('./auth.route'));
router.use('/settings', require('./setting.route'));

module.exports = router;
