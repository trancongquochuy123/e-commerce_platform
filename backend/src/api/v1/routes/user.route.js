const express = require('express');
const router = express.Router();

const validate = require('../validators/user.validator.js');
const controller = require('../controllers/user.controller.js');
const userMiddleware = require('../middlewares/user.middleware.js');

// Routes không cần đăng nhập (dùng checkLoggedIn để tránh user đã login vào lại)
/**
 * @swagger
 * /api/v1/user/register:
 *   get:
 *     summary: Get register page
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Register page
 *   post:
 *     summary: Register new user
 *     tags:
 *       - User
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
 *         description: Registration successful
 */
router.get('/register', userMiddleware.checkLoggedIn, controller.register);
router.post('/register', userMiddleware.checkLoggedIn, validate.registerPost, controller.registerPost);

/**
 * @swagger
 * /api/v1/user/login:
 *   get:
 *     summary: Get login page
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Login page
 *   post:
 *     summary: User login
 *     tags:
 *       - User
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
router.get('/login', userMiddleware.checkLoggedIn, controller.login);
router.post('/login', userMiddleware.checkLoggedIn, validate.loginPost, controller.loginPost);

// Forgot password không cần check logged in (vì user quên mật khẩu có thể đang không login)
/**
 * @swagger
 * /api/v1/user/password/forgot:
 *   get:
 *     summary: Get forgot password page
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Forgot password page
 *   post:
 *     summary: Request forgot password
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reset link sent
 */
router.get('/password/forgot', controller.forgotPassword);
router.post('/password/forgot', validate.forgotPasswordPost, controller.forgotPasswordPost);

/**
 * @swagger
 * /api/v1/user/password/otp:
 *   get:
 *     summary: Get OTP verification page
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: OTP verification page
 *   post:
 *     summary: Verify OTP
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified
 */
router.get('/password/otp', controller.otpPassword);
router.post('/password/otp', validate.otpPasswordPost, controller.otpPasswordPost);

/**
 * @swagger
 * /api/v1/user/password/reset:
 *   get:
 *     summary: Get password reset page
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Password reset page
 *   post:
 *     summary: Reset password
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 */
router.get('/password/reset', controller.resetPassword);
router.post('/password/reset', validate.resetPasswordPost, controller.resetPasswordPost);

// Logout cần đăng nhập
/**
 * @swagger
 * /api/v1/user/logout:
 *   get:
 *     summary: User logout
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.get('/logout', userMiddleware.requireAuth, controller.logout);

// Thêm các routes cần đăng nhập khác (ví dụ)
/**
 * @swagger
 * /api/v1/user/info:
 *   get:
 *     summary: Get user info
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information
 *   post:
 *     summary: Update user info
 *     tags:
 *       - User
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
 *         description: User info updated
 */
router.get('/info', userMiddleware.requireAuth, controller.info);
router.post('/info', userMiddleware.requireAuth, controller.infoPost);

/**
 * @swagger
 * /api/v1/user/shop/{id}:
 *   get:
 *     summary: Get shop information by seller ID
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Seller/Shop ID
 *     responses:
 *       200:
 *         description: Shop information
 */
router.get("/shop/:id", controller.getShop);
// Become seller route (requires authentication)
/**
 * @swagger
 * /api/v1/user/become-seller:
 *   post:
 *     summary: Apply to become a seller
 *     tags:
 *       - User
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
 *         description: Seller application submitted
 */
router.post('/become-seller', userMiddleware.requireAuth, controller.becomeSeller);


// Thêm các routes cần đăng nhập khác (ví dụ)
// router.get('/profile', userMiddleware.requireAuth, controller.profile);
// router.get('/orders', userMiddleware.requireAuth, controller.orders);

module.exports = router;