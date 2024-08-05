const express = require('express');
const router = express.Router();
const  SearchProducts  = require('../controllers/searchController');

//route to search products
router.route('/').get(SearchProducts.searchProducts); 
module.exports = router;
