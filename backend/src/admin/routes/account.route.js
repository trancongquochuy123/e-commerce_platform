const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadCloudinary } = require('../middlewares/uploadCloud.middleware.js');

const upload = multer();

const controller = require('../controllers/account.controller.js');

/**
 * @swagger
 * /admin/accounts:
 *   get:
 *     summary: Get all accounts
 *     tags:
 *       - Admin Accounts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of accounts
 */
router.get("/", controller.index);

/**
 * @swagger
 * /admin/accounts/create:
 *   get:
 *     summary: Get account creation form
 *     tags:
 *       - Admin Accounts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Creation form
 *   post:
 *     summary: Create new account
 *     tags:
 *       - Admin Accounts
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
 *         description: Account created
 */
router.get("/create", controller.create);

// Multer
router.post('/create',
    upload.single('avatar'),
    uploadCloudinary('accounts/avatars'),
    // validate.createAccount,
    controller.createAccount
);

/**
 * @swagger
 * /admin/accounts/delete/{id}:
 *   delete:
 *     summary: Delete account
 *     tags:
 *       - Admin Accounts
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
 *         description: Account deleted
 */

/**
 * @swagger
 * /admin/accounts/edit/{id}:
 *   get:
 *     summary: Get account edit form
 *     tags:
 *       - Admin Accounts
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
 *     summary: Update account
 *     tags:
 *       - Admin Accounts
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
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Account updated
 */
router.get("/edit/:id", controller.edit);

router.patch('/edit/:id',
    upload.single('avatar'),
    uploadCloudinary('accounts/avatars'),
    // validate.editAccount,
    controller.editAccount
);

module.exports = router;