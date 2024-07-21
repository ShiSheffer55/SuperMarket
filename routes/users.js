const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Import User model
const { isAdmin } = require('../controllers/passController'); // Admin check middleware

// User registration
router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    const { userName, fName, lName, password, gmail, tel, city, isLivesInCenter, role } = req.body;
    try {
        const user = new User({ userName, fName, lName, password, gmail, tel, city, isLivesInCenter, role });
        await user.save();
        res.redirect('/login');
    } catch (err) {
        console.log('Error registering user:', err);
        res.status(500).send('Internal Server Error');
    }
});

// User login
router.get('/login', (req, res) => {
    res.render('login');
});

// Additional user routes for profile management, login handling, etc.

module.exports = router;
