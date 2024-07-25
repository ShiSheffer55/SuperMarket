const bcrypt = require('bcrypt');
const User = require('../models/user'); 


// Render login form
exports.renderLoginForm =  (req, res) => {
    res.render('login'); 
};

exports.renderRegisterForm=  (req, res) => {
    res.render('register'); 
};

exports.loginUser = async (req, res) => {
    exports.loginUser = async (req, res) => {
        const { username, password } = req.body;
    
        try {
            // Find user by username
            const user = await User.findOne({ userName: username });
    
            if (!user) {
                req.flash('error_msg', 'Invalid username or password');
                return res.redirect('/users/login');
            }
    
            // Compare password
            const isMatch = await bcrypt.compare(password, user.password);
    
            if (!isMatch) {
                req.flash('error_msg', 'Invalid username or password');
                return res.redirect('/users/login');
            }
    
            // Set session
            req.session.user = {
                _id: user._id,
                userName: user.userName,
                role: user.role
            };
    
            req.flash('success_msg', 'You are now logged in');
            res.redirect('/');
        } catch (err) {
            console.error('Error logging in:', err);
            req.flash('error_msg', 'Something went wrong');
            res.redirect('/users/login');
        }
    };
};

exports.logoutUser = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error logging out:', err);
            req.flash('error_msg', 'Something went wrong');
        } else {
            req.flash('success_msg', 'You have been logged out');
        }
        res.redirect('/');
    });
};
