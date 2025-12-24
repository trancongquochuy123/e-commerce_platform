const express = require("express");
const router = express.Router();

const controller = require('../controllers/order.controller');

/**
 * @swagger
 * /admin/orders:
 *   get:
 *     summary: Get all orders (admin)
 *     tags:
 *       - Admin Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 */
router.get("/", controller.index);

/**
 * @swagger
 * /admin/orders/detail/{id}:
 *   get:
 *     summary: Get order detail
 *     tags:
 *       - Admin Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order detail
 */
router.get("/detail/:id", controller.detail);

/**
 * @swagger
 * /admin/orders/change-status/{status}/{id}:
 *   post:
 *     summary: Change order status
 *     tags:
 *       - Admin Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         description: New status (pending, processing, shipped, delivered, cancelled)
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Status updated
 */
router.post("/change-status/:status/:id", controller.changeStatus);

/**
 * @swagger
 * /admin/orders/delete/{id}:
 *   post:
 *     summary: Delete order
 *     tags:
 *       - Admin Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order deleted
 */
router.post("/delete/:id", controller.deleteOrder);

/**
 * @swagger
 * /admin/orders/restore/{id}:
 *   post:
 *     summary: Restore deleted order
 *     tags:
 *       - Admin Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order restored
 */
router.post("/restore/:id", controller.restoreOrder);

module.exports = router;
