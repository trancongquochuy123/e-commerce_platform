const express = require('express');
const router = express.Router();

const controller = require('../controllers/shop.controller.js');

/**
 * @swagger
 * /api/v1/shop/{id}:
 *   get:
 *     summary: Get shop products by seller ID
 *     tags:
 *       - Shop
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Seller/Shop ID
 *     responses:
 *       200:
 *         description: List of products from the shop
 */
router.get("/:id", controller.getShopProducts);

module.exports = router;