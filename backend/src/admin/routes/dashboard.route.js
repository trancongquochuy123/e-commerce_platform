const express = require('express');
const router = express.Router();

const controller = require('../controllers/dashboard.controller');

/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     summary: Get admin dashboard
 *     tags:
 *       - Admin Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data
 */
router.get("/", controller.dashboard);

module.exports = router;