const express = require('express');
const router = express.Router();

const controller = require('../controllers/shop.controller.js');

router.get("/:id", controller.getShopProducts);

module.exports = router;