const express = require('express');
const router = express.Router();

const cartController = require('../controllers/cart.controller');

/**
 * @swagger
 * /api/v1/cart:
 *   get:
 *     summary: Get shopping cart
 *     tags:
 *       - Cart
 *     responses:
 *       200:
 *         description: Shopping cart contents
 */
router.get('/', cartController.getCart);

/**
 * @swagger
 * /api/v1/cart/add/{productId}:
 *   post:
 *     summary: Add product to cart
 *     tags:
 *       - Cart
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Product added to cart
 */
router.post('/add/:productId', cartController.addToCart);

/**
 * @swagger
 * /api/v1/cart/update:
 *   patch:
 *     summary: Update cart item
 *     tags:
 *       - Cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cart item updated
 */
router.patch('/update', cartController.updateCartItem);

/**
 * @swagger
 * /api/v1/cart/delete/{productId}:
 *   delete:
 *     summary: Remove product from cart
 *     tags:
 *       - Cart
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product removed from cart
 */
router.delete('/delete/:productId', cartController.removeFromCart);

/**
 * @swagger
 * /api/v1/cart/clear:
 *   delete:
 *     summary: Clear shopping cart
 *     tags:
 *       - Cart
 *     responses:
 *       200:
 *         description: Cart cleared
 */
router.delete('/clear', cartController.clearCart);

module.exports = router;