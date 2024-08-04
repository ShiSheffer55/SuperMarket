const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { isUser } = require('../controllers/passController');


// Ensure these routes match what you expect for the cart functionality
router.post('/add', isUser, cartController.addToCart);
router.get('/', isUser, cartController.viewCart);
router.get('/checkout', isUser, cartController.checkout);
router.post('/place-order', isUser, cartController.placeOrder);

// Remove a product from the cart
router.post('/delete/:name', (req, res, next) => {
    console.log('Received request to delete product:', req.params.name);
    next(); // Proceed to the actual controller function
}, cartController.removeProductFromCart);

// Empty the cart
router.post('/empty', cartController.emptyCart);

module.exports = router;





