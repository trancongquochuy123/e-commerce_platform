const express = require("express");
const router = express.Router();

const controller = require("../controllers/checkout.controller.js");
const userMiddleware = require("../middlewares/user.middleware.js");
const cartMiddleware = require("../middlewares/cart.middleware.js");

router.get("/", controller.index);

router.get("/order", userMiddleware.infoUser, controller.getOrder);
router.get("/boughts", userMiddleware.infoUser, controller.getBought);
router.post("/order", userMiddleware.infoUser, controller.order);

// Stripe payment confirmation endpoint
router.post("/confirm-payment", controller.confirmPayment);

router.get("/success/:orderId", controller.success);

module.exports = router;
