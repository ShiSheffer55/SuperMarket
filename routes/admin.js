const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Import the User model
const { isAdmin } = require('../controllers/passController'); // Import the admin check middleware

// Route to show admin dashboard
router.get('/adminDashboard', isAdmin, (req, res) => {
    res.render('adminDashboard');
});


// Route to view all users (admin only)
router.get('/users', isAdmin, async (req, res) => {
    try {
        const users = await User.find().exec();
        res.render('adminUsers', { users });
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Route to view a specific user (admin only)
router.get('/users/:id', isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id).exec();
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.render('adminUserDetail', { user });
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Route to delete a user (admin only)
router.get('/users/delete/:id', isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await User.findByIdAndDelete(id).exec();
        if (!deletedUser) {
            return res.status(404).send('User not found');
        }
        res.redirect('/admin/users');
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
