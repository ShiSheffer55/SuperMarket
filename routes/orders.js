const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');

// נתיב להיסטוריית הזמנות של משתמש
router.get('/:userId', ordersController.getOrderHistory);

module.exports = router;
