const express = require("express");
const router = express.Router();

const dashboardRoutes = require("./dashboard.route");
const productRoutes = require("./product.route");
const productCategoryRoutes = require("./product-category.route");
const orderRoutes = require("./order.route");
const roleRoutes = require("./role.route");
const accountRoutes = require("./account.route");
const authRoutes = require("./auth.route");
const myAccountRoutes = require("./my-account.route");
const settingRoutes = require("./setting.route");
const sellerProductRoutes = require("./seller-product.route");

const authMiddleware = require("../middlewares/auth.middleware");
const permissionMiddleware = require("../middlewares/permission.middleware");

module.exports = (app) => {
  app.use("/admin/dashboard", authMiddleware.requireAuth, dashboardRoutes);

  app.use("/admin/products", authMiddleware.requireAuth, productRoutes);

  app.use(
    "/admin/products-category",
    authMiddleware.requireAuth,
    productCategoryRoutes
  );

  app.use("/admin/orders", authMiddleware.requireAuth, orderRoutes);

  app.use("/admin/roles", authMiddleware.requireAuth, roleRoutes);

  app.use("/admin/accounts", authMiddleware.requireAuth, accountRoutes);

  app.use("/admin/auth", authRoutes);

  app.use("/admin/my-account", authMiddleware.requireAuth, myAccountRoutes);

  app.use("/admin/settings", authMiddleware.requireAuth, settingRoutes);

  app.use(
    "/admin/seller/products",
    authMiddleware.requireAuth,
    sellerProductRoutes
  );
};
