const Product = require('../models/product'); 
const User = require('../models/user'); 
const Order = require('../models/order'); 

// Admin Dashboard
const showAdminDashboard = (req, res) => {
    res.render('admin/adminDashboard'); 
};

// Products
const renderAdminProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.render('admin/adminProducts', { products });
    } catch (err) {
        console.error('Error fetching products:', err);
        req.flash('error_msg', 'Failed to fetch products');
        res.redirect('/adminDashboard');
    }
};

// Users
const renderAdminUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.render('admin/adminUsers', { users });
    } catch (err) {
        console.error('Error fetching users:', err);
        req.flash('error_msg', 'Failed to fetch users');
        res.redirect('/adminDashboard');
    }
};

// Orders
const renderAdminOrders = async (req, res) => {
    try {
        const orders = await Order.find({});
        res.render('admin/adminOrders', { orders });
    } catch (err) {
        console.error('Error fetching orders:', err);
        req.flash('error_msg', 'Failed to fetch orders');
        res.redirect('/adminDashboard');
    }
};

// Export all functions at the end
module.exports = {
    showAdminDashboard,
    renderAdminProducts,
    renderAdminUsers,
    renderAdminOrders
};
