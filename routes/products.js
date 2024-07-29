const express = require('express');
const router = express.Router();
const {
    getRecommendedProducts,
    getProductsFromCollection
} = require('../controllers/productsController');

// Route to view all the recommended products (accessible to all users)
router.get('/', getRecommendedProducts);

// Route to get products from a specific collection
router.get('/:collectionName', getProductsFromCollection);


const filtersController = require('../controllers/filtersController');
router.get('/filter', filtersController.filterProducts);


module.exports = router;



