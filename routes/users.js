const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Make sure this path is correct
const bcrypt = require('bcrypt');

// Render the registration form
router.get('/register', (req, res) => {
    res.render('register');
});

// Handle registration form submission
router.post('/register', async (req, res) => {
    const { userName, fName, lName, password, gmail, tel, city, isLivesInCenter, role } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            userName,
            fName,
            lName,
            password: hashedPassword,
            gmail,
            tel,
            city,
            isLivesInCenter,
            role
        });

        // Save the user
        await newUser.save();

        req.flash('success_msg', 'You are now registered and can log in');
        res.redirect('/users/login');
    } catch (err) {
        console.error('Error registering user:', err);
        req.flash('error_msg', 'Error registering user');
        res.redirect('/users/register');
    }
});


// Render the login form
router.get('/login', (req, res) => {
    res.render('login');
});



// Handle login form submission
router.post('/login', async (req, res) => {
    const { userName, password } = req.body;

    try {
        const user = await User.findOne({ userName });
        if (!user) {
            req.flash('error_msg', 'No user found');
            return res.redirect('/users/login');
        }

        // Compare the provided password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.flash('error_msg', 'Invalid credentials');
            return res.redirect('/users/login');
        }

        // Store user info in session
        req.session.user = user;
        req.flash('success_msg', 'You are logged in');
        res.redirect('/');
    } catch (err) {
        console.error('Error logging in user:', err);
        req.flash('error_msg', 'Error logging in user');
        res.redirect('/users/login');
    }
});

module.exports = router;
