const express = require('express');
const router = express.Router();
const { isAdmin } = require('../controllers/passController'); // Admin check middleware

// Admin dashboard
router.get('/', isAdmin, (req, res) => {
    res.render('adminDashboard');
});

// Additional admin routes can be added here

module.exports = router;
