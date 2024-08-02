const express = require('express');
const router = express.Router();
const locationsController = require('../controllers/locationController');

router.get('/locations', locationsController.getLocations);
router.get('/map', locationsController.renderLocations);
// router.get('/locations', locationsController.getLocations);
module.exports = router;