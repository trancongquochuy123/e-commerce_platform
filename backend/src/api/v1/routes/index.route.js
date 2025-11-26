// src/api/v1/routes/index.route.js
const express = require('express');
const router = express.Router();

// Config
const systemConfig = require('../../../../config/system.js');

// Middlewares
const adminAuth = require('../middlewares/admin/auth.middleware.js');
const permission = require('../middlewares/admin/permission.middleware.js');

// Sub routers
const adminRoutes = require('./admin/index.route.js');
const clientRoutes = require('./client/index.route.js');

console.log('📦 Loading API v1 routes...');

/** -------------------------------------------------------
 *  CLIENT ROUTES (Public)
 *  Mount at: /api/v1/*
 * -------------------------------------------------------- */
router.use('/', clientRoutes);

/** -------------------------------------------------------
 *  ADMIN ROUTES (Private)
 *  Mount at: /api/v1/admin/*
 * -------------------------------------------------------- */
const PATH_ADMIN = systemConfig.prefixAdmin || '/admin';

router.use(
    PATH_ADMIN,
    adminAuth.requireAuth,     // Bắt buộc login
    permission.checkRole,      // Kiểm tra quyền
    adminRoutes                // Nhóm admin routes
);

console.log('✅ API v1 routes loaded successfully!');

module.exports = router;