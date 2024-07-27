const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const passController = require('../controllers/passController');

// Add item to cart
router.post('/add', passController.ensureAuthenticated, cartController.addToCart);

// View cart
router.get('/', passController.ensureAuthenticated, cartController.viewCart);

// Remove item from cart
router.post('/remove', passController.ensureAuthenticated, cartController.removeFromCart);

module.exports = router;
