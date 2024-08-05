// controllers/adminController.js
const getProductModel = require('../models/getProductModel');
const User = require('../models/user');
const Order = require('../models/order');


// render Admin Dashboard
const showAdminDashboard = (req, res) => {
    console.log('Rendering admin dashboard');
    res.render('adminDashboard', { user: req.session.user });
};

// Render Admin Products Page
const renderAdminProducts = async (req, res) => {

    try {
        //a list of all the collections in the products database
        const collections = ['frozen', 'sweets and snacks','milk', 'fruits', 'vegetables', 'drinks','Bread and pastries', 'dry','cleanliness',  'meat', 'fish']; // Replace with your actual collection names
        let products = [];

        //a loop on the collections 
        for (const collectionName of collections) {
            const collection = await getProductModel(collectionName);//define the specific collection 
            const foundProducts = await collection.find({}).exec(); //find all products from the collection
            console.log(`Found ${foundProducts.length} products in ${collectionName}`); //print how many products are in the collection

            // Attach the collection name to each product
            foundProducts.forEach(product => product.collectionName = collectionName);//for using later instead of doing the same loop on the collections

            //concat the foundProducts in the products array 
            products = products.concat(foundProducts);
        }

        console.log(products.length);
        res.render('adminProducts', { products });//render the page with the products array 
    } catch (err) {
        console.log('Error fetching  products:', err);
        res.status(500).send('Internal Server Error');
    }
};


// Render Admin Users Page
const renderAdminUsers = async (req, res) => {
    try {
        const users = await User.find({});//find all users 
        res.render('adminUsers', { users, user: req.session.user });//render the page with the users and allows to access session-specific user information in adminUsers.ejs 
    } catch (err) {
        console.error('Error fetching users:', err);
        req.flash('error_msg', 'Failed to fetch users');
        res.redirect('/admin/dashboard'); //redirect to adminDashboard
    }
};

// Render Admin Orders Page
const renderAdminOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user'); // find all orders and populate user data (the user field in order model with the actual data from users)
        res.render('adminOrders', { orders }); //render the page with the orders
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Server error');
    }
};


const getOrdersPerDay = async (req, res) => {
    try {
        // define the start of the current month
        const startOfMonth = new Date(
            new Date().getFullYear(),  // current year
            new Date().getMonth(),     // current month (0-indexed)
            1                          // first day of the month
        );

        // define the end of the current month
        const endOfMonth = new Date(
            new Date().getFullYear(),              // current year
            new Date().getMonth() + 1,             // next month
            0                                      // last day of the previous month (end of current month)
        );

        // perform an aggregation query to get the count of orders per day
        const orders = await Order.aggregate([
            {
                //filters the orders to include only those created in the current month
                $match: {
                    createdAt: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            {
                //groups the filtered orders by year, month, and day, and counts the number of orders for each day
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },  // extract year from createdAt
                        month: { $month: '$createdAt' },  // extract month from createdAt
                        day: { $dayOfMonth: '$createdAt' } // extract day from createdAt
                    },
                    count: { $sum: 1 }  // count the number of orders per day
                }
            },
            {
                //sort the results by year, month, and day in asc order
                $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
            },
            {
                //formats the result to include a date field with the full date and a count field with the number of orders for each day.
                $project: {
                    date: {
                        $dateFromParts: {
                            year: '$_id.year',   // year from grouped data
                            month: '$_id.month', // month from grouped data
                            day: '$_id.day'     // day from grouped data
                        }
                    },
                    count: 1  // include the count of orders
                }
            }
        ]);

        // send the aggregated orders data as a JSON response
        res.json(orders);
    } catch (err) {
        // log any errors and send a 500 server error response
        console.error('Error fetching orders per day:', err);
        res.status(500).send('Server error');
    }
};





module.exports = {
    showAdminDashboard,
    renderAdminProducts,
    renderAdminUsers,
    renderAdminOrders,
    getOrdersPerDay
};
