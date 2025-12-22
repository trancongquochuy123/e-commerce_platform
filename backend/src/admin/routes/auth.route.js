const express = require('express');
const router = express.Router();

const controller = require('../controllers/auth.controller');

const validate = require('../validators/auth.validator');

/**
 * @swagger
 * /admin/auth/login:
 *   get:
 *     summary: Get admin login page
 *     tags:
 *       - Admin Auth
 *     responses:
 *       200:
 *         description: Login page
 *   post:
 *     summary: Admin login
 *     tags:
 *       - Admin Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.get("/login", controller.login);

router.post("/login", validate.loginPost, controller.loginPost);

/**
 * @swagger
 * /admin/auth/logout:
 *   get:
 *     summary: Admin logout
 *     tags:
 *       - Admin Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.get("/logout", controller.logout);

module.exports = router;