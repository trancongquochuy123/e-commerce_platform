const express = require("express");
const router = express.Router();

const controller = require("../controllers/checkout.controller.js");
const userMiddleware = require("../middlewares/user.middleware.js");
const cartMiddleware = require("../middlewares/cart.middleware.js");

/**
 * @swagger
 * /api/v1/checkout:
 *   get:
 *     summary: Get checkout page
 *     tags:
 *       - Checkout
 *     responses:
 *       200:
 *         description: Checkout page
 */
router.get("/", controller.index);

/**
 * @swagger
 * /api/v1/checkout/order:
 *   get:
 *     summary: Get user orders
 *     tags:
 *       - Checkout
 *     responses:
 *       200:
 *         description: List of user orders
 *   post:
 *     summary: Create new order
 *     tags:
 *       - Checkout
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *               shippingAddress:
 *                 type: object
 *     responses:
 *       201:
 *         description: Order created successfully
 */
router.get("/order", userMiddleware.infoUser, controller.getOrder);
router.post("/order", userMiddleware.infoUser, controller.order);

/**
 * @swagger
 * /api/v1/checkout/boughts:
 *   get:
 *     summary: Get purchased orders
 *     tags:
 *       - Checkout
 *     responses:
 *       200:
 *         description: List of purchased orders
 */
router.get("/boughts", userMiddleware.infoUser, controller.getBought);

/**
 * @swagger
 * /api/v1/checkout/confirm-payment:
 *   post:
 *     summary: Confirm Stripe payment
 *     tags:
 *       - Checkout
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Payment confirmed
 */
router.post("/confirm-payment", controller.confirmPayment);

/**
 * @swagger
 * /api/v1/checkout/success/{orderId}:
 *   get:
 *     summary: Get order success confirmation page
 *     tags:
 *       - Checkout
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order success page
 */
router.get("/success/:orderId", controller.success);

module.exports = router;
