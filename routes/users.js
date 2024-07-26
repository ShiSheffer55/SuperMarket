const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt'); // Assuming you are using bcrypt for password hashing

router.post('/register', async (req, res) => {
    const { userName, fName, lName, password, gmail, tel, city, isLivesInCenter, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
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

        await newUser.save();
        req.flash('success_msg', 'You are now registered and can log in');
        res.redirect('/'); // Redirect to the homepage after registration
    } catch (err) {
        console.error('Error registering user:', err);
        req.flash('error_msg', 'Error registering user');
        res.redirect('/register'); // Redirect back to the registration page if there's an error
    }
});



// Show login form
router.get('/login', (req, res) => {
    res.render('login');
});

// Handle login
router.post('/login', async (req, res) => {
    const { userName, password } = req.body;
    try {
        const user = await User.findOne({ userName });
        if (!user) {
            req.flash('error_msg', 'Invalid username or password');
            return res.redirect('/users/login');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.flash('error_msg', 'Invalid username or password');
            return res.redirect('/users/login');
        }

        req.session.user = user;
        res.redirect('/');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'An error occurred during login');
        res.redirect('/users/login');
    }
});

// Handle logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            req.flash('error_msg', 'An error occurred during logout');
            return res.redirect('/');
        }
        res.redirect('/users/login');
    });
});

module.exports = router;
