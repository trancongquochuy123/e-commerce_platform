const express = require('express');
const router = express.Router();
const multer = require('multer');

const { uploadCloudinary } = require('../middlewares/uploadCloud.middleware.js');
const upload = multer();

const controller = require('../controllers/my-account.controller');

/**
 * @swagger
 * /admin/my-account:
 *   get:
 *     summary: Get current admin account info
 *     tags:
 *       - Admin My Account
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account information
 */
router.get("/", controller.index);

/**
 * @swagger
 * /admin/my-account/edit:
 *   get:
 *     summary: Get account edit form
 *     tags:
 *       - Admin My Account
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Edit form
 *   patch:
 *     summary: Update account information
 *     tags:
 *       - Admin My Account
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Account updated
 */
router.get("/edit", controller.edit);

router.patch("/edit", 
    upload.single('avatar'),
    uploadCloudinary('accounts/avatars'),
    controller.editPatch,
);

module.exports = router;