// controllers/adminController.js
const getProductModel = require('../models/getProductModel');
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
        const collections = ['frozen', 'sweets and snacks','milk', 'fruits', 'vegetables', 'drinks','Bread and pastries', 'dry','cleanliness',  'meat', 'fish']; // Replace with your actual collection names
        let products = [];

        for (const collectionName of collections) {
            const collection = await getProductModel(collectionName);
            const foundProducts = await collection.find({}).exec();
            console.log(`Found ${foundProducts.length} products in ${collectionName}`);

            // Attach the collection name to each product
            foundProducts.forEach(product => product.collectionName = collectionName);

            products = products.concat(foundProducts);
        }

        console.log(products.length);
        res.render('adminProducts', { products });
    } catch (err) {
        console.log('Error fetching  products:', err);
        res.status(500).send('Internal Server Error');
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
        const orders = await Order.find().populate('user'); // Populate User
        res.render('adminOrders', { orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Server error');
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
