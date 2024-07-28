const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt'); // Assuming you are using bcrypt for password hashing
const userController = require('../controllers/usersController');



// Show login form
router.get('/login', (req, res, next) => {
    console.log('Login route accessed');
    userController.renderLoginForm(req, res, next);
});


// Handle login
router.post('/login', userController.loginUser); 

// Handle logout
router.get('/logout', userController.logoutUser); 

router.get('/register', userController.renderRegisterForm); 

router.post('/register', userController.registerUser); 



module.exports = router;
