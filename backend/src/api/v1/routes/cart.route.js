const express = require('express');
const router = express.Router();

const cartController = require('../controllers/cart.controller');

router.get('/', cartController.getCart);
router.post('/add/:productId', cartController.addToCart);
router.patch('/update', cartController.updateCartItem);
router.delete('/delete/:productId', cartController.removeFromCart);
router.delete('/clear', cartController.clearCart);

module.exports = router;