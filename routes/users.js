const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt'); // Assuming you are using bcrypt for password hashing
const userController = require('../controllers/usersController');



// Show login form
router.get('/login', userController.renderLoginForm); 
// Handle login
router.post('/login', userController.loginUser); 

// Handle logout
router.get('/logout', userController.logoutUser); 

router.get('/register', userController.renderRegisterForm); 

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
        res.redirect('/users/register'); // Redirect back to the registration page if there's an error
    }
});


module.exports = router;
