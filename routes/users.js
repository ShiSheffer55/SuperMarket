const express = require('express');
const router = express.Router();
const User = require('../models/user');

// User registration
router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    const { userName, fName, lName, password, gmail, tel, city, isLivesInCenter } = req.body;

    // You should include password hashing in a real application for security
    const newUser = new User({
        userName,
        fName,
        lName,
        password, // Avoid storing passwords in plain text in a real application
        gmail,
        tel,
        city,
        isLivesInCenter
    });

    try {
        await newUser.save();
        req.flash('success_msg', 'You are now registered and can log in');
        res.redirect('/users/login');
    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'Registration failed');
        res.redirect('/users/register');
    }
});

// User login
router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    const { userName, password } = req.body;

    try {
        const user = await User.findOne({ userName });

        if (!user || user.password !== password) { // In a real application, use bcrypt for password comparison
            req.flash('error_msg', 'Invalid credentials');
            return res.redirect('/users/login');
        }

        req.session.user = user;
        req.flash('success_msg', 'You are now logged in');
        res.redirect('/');
    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'Login failed');
        res.redirect('/users/login');
    }
});

// User logout
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        res.redirect('/users/login');
    });
});

module.exports = router;
