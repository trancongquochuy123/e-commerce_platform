// src/api/v1/routes/index.js
const express = require('express');
const router = express.Router();

// Config
const systemConfig = require('../../../../config/system.js');

// Middlewares
const adminAuth = require('../middlewares/admin/auth.middleware.js');
const permission = require('../middlewares/admin/auth.middleware.js');

// Sub routers
// --- ADMIN ---
const adminRoutes = require('./admin/index.route.js');
// --- CLIENT ---
const clientRoutes = require('./client/index.route.js');

// Combine routes
module.exports = (app) => {
    /** -------------------------------------------------------
     *  CLIENT ROUTES (Public)
     * -------------------------------------------------------- */
    app.use('/api/v1', clientRoutes);


    /** -------------------------------------------------------
     *  ADMIN ROUTES (Private)
     * -------------------------------------------------------- */
    const PATH_ADMIN = systemConfig.prefixAdmin || '/admin';

    app.use(
        `/api/v1${PATH_ADMIN}`,
        adminAuth.requireAuth,     // Bắt buộc login
        permission.checkRole,      // Kiểm tra quyền
        adminRoutes                // Nhóm admin routes
    );

    return app;
};
