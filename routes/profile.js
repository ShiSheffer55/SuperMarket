const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

//routs to display the user's personal details
router.get('/', profileController.profile);

module.exports = router;