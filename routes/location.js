const express = require('express');
const router = express.Router();
const locationsController = require('../controllers/locationsController');

router.get('/locations', locationsController.getLocations);
router.get('/map', locationsController.renderLocations);


module.exports = router;
