// src/api/v1/routes/client/index.js
console.log("📌 Client routes loaded!");

const express = require("express");
const router = express.Router();

// Middlewares
const settingsMiddleware = require("../../../admin/middlewares/setting.middleware");
const categoryMiddleware = require("../middlewares/category.middleware");
const cartMiddleware = require("../middlewares/cart.middleware");
const userMiddleware = require("../middlewares/user.middleware");

// Validation + Rate limit
const validateRequest = require("../middlewares/validateRequest.middleware");
const cartRateLimit = require("../middlewares/cartRateLimit.middleware");

// Apply middlewares cho toàn bộ client routes
router.use(validateRequest.validateRequest);
// router.use(cartRateLimit.cartCreationLimit);

router.use(settingsMiddleware.SettingGeneral);
router.use(categoryMiddleware.category);
// router.use(cartMiddleware.cartId);
router.use(userMiddleware.infoUser);

// Sub routes
router.use("/", require("./home.route"));
router.use("/products", require("./product.route"));
router.use("/search", require("./search.route"));
router.use("/cart", cartMiddleware.cartId, require("./cart.route"));
router.use("/checkout", require("./checkout.route")); // Auth trong file route riêng
router.use("/user", require("./user.route"));

module.exports = router;
