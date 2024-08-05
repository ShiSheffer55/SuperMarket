const express = require('express');
const router = express.Router();
const locationsController = require('../controllers/locationController');


//routes to display the maps of the supermarket's branches 
router.get('/locations', locationsController.getLocations);
router.get('/map', locationsController.renderLocations);
router.get('/weather', locationsController.renderWeather);
module.exports = router;