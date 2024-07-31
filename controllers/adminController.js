// controllers/adminController.js
const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order');

// Admin Dashboard
const showAdminDashboard = (req, res) => {
    console.log('Rendering admin dashboard');
    res.render('adminDashboard', { user: req.session.user });
};

// Render Admin Products Page
const renderAdminProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.render('products', { products, user: req.session.user });
    } catch (err) {
        console.error('Error fetching products:', err);
        req.flash('error_msg', 'Failed to fetch products');
        res.redirect('/admin/dashboard');  // Ensure the redirection path is correct
    }
};

// Render Admin Users Page
const renderAdminUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.render('adminUsers', { users, user: req.session.user });
    } catch (err) {
        console.error('Error fetching users:', err);
        req.flash('error_msg', 'Failed to fetch users');
        res.redirect('/admin/dashboard');  // Ensure the redirection path is correct
    }
};

// Render Admin Orders Page
const renderAdminOrders = async (req, res) => {
    try {
        const orders = await Order.find({});
        res.render('adminOrders', { orders, user: req.session.user });
    } catch (err) {
        console.error('Error fetching orders:', err);
        req.flash('error_msg', 'Failed to fetch orders');
        res.redirect('/admin/dashboard');
    }
};
const getAverageOrdersPerDay = async (req, res) => {
    try {
        const orders = await Order.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                        day: { $dayOfMonth: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
            },
            {
                $project: {
                    date: {
                        $dateFromParts: {
                            year: '$_id.year',
                            month: '$_id.month',
                            day: '$_id.day'
                        }
                    },
                    count: 1
                }
            }
        ]);

        res.json(orders);
    } catch (err) {
        console.error('Error fetching average orders per day:', err);
        res.status(500).send('Server error');
    }
};

module.exports = {
    showAdminDashboard,
    renderAdminProducts,
    renderAdminUsers,
    renderAdminOrders,
    getAverageOrdersPerDay
};
