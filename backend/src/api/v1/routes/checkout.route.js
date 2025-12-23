const express = require("express");
const router = express.Router();

const controller = require("../controllers/checkout.controller.js");
const userMiddleware = require("../middlewares/user.middleware.js");
const cartMiddleware = require("../middlewares/cart.middleware.js");

router.get("/", controller.index);
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
router.get('/', controller.index);

router.get("/order", userMiddleware.infoUser, controller.getOrder);
router.get("/boughts", userMiddleware.infoUser, controller.getBought);
router.post("/order", userMiddleware.infoUser, controller.order);

// Stripe payment confirmation endpoint
router.post("/confirm-payment", controller.confirmPayment);
/**
 * @swagger
 * /api/v1/checkout/order:
 *   post:
 *     summary: Create order
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
 *       200:
 *         description: Order created successfully
 */
router.post('/order',userMiddleware.infoUser, controller.order);

router.get("/success/:orderId", controller.success);
/**
 * @swagger
 * /api/v1/checkout/success/{orderId}:
 *   get:
 *     summary: Get order success page
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
router.get('/success/:orderId', controller.success);

module.exports = router;
