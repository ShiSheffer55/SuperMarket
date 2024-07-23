const express = require('express');
const router = express.Router();
const  SearchProducts  = require('../controllers/searchController');


router.route('/').get(SearchProducts.searchProducts)
module.exports = router;
