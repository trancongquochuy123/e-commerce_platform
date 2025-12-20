const express = require('express');
const router = express.Router();

const controller = require('../controllers/checkout.controller.js');
const userMiddleware = require('../middlewares/user.middleware.js');

router.get('/', controller.index);

router.post('/order',userMiddleware.infoUser, controller.order);

router.get('/success/:orderId', controller.success);

module.exports = router;