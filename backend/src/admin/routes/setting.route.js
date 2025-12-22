const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { uploadCloudinary } = require('../middlewares/uploadCloud.middleware.js');

const controller = require('../controllers/setting.controller.js');

/**
 * @swagger
 * /admin/setting/general:
 *   get:
 *     summary: Get general settings
 *     tags:
 *       - Admin Settings
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: General settings
 *   post:
 *     summary: Update general settings
 *     tags:
 *       - Admin Settings
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               logo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Settings updated
 */
router.get("/general", controller.generalGet);

router.post("/general", 
    upload.single('logo'), 
    uploadCloudinary('settings/general'), 
    controller.generalPost);

module.exports = router;