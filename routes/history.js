const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController'); 

// נתיבים עבור היסטוריית ההזמנות
router.get('/:userId', ordersController.getOrderHistory);

module.exports = router;
