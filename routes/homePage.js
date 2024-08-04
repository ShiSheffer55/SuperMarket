const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homePageController');

//route to the homepage rendering 
router.get('/', homeController.homePage);

module.exports = router;