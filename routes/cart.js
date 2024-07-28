const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { isUser } = require('../controllers/passController');

router.post('/add', isUser, cartController.addToCart);
router.get('/', isUser, cartController.viewCart);
router.get('/checkout', isUser, cartController.checkout);
router.post('/place-order', isUser, cartController.placeOrder);

module.exports = router;
