const mongoose = require('mongoose');

const Order = require('../models/order');
const User = require('../models/user');

// פונקציה להציג את היסטוריית ההזמנות
const getOrderHistory = async (req, res) => {
    try {
        // שליפת ההזמנות של המשתמש לפי מזהה
        const orders = await Order.find({ user: req.params.userId });
       
        res.render('orderHistory', { orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Server error');
    }
};

const renderEditOrderForm = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user').populate('products.productId');
        if (!order) {
            return res.status(404).send('Order not found');
        }
        res.render('editOrder', { order});
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).send('Server error');
    }
};

const updateOrder = async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedOrder) {
            return res.status(404).send('Order not found');
        }
        res.redirect('/admin/orders');
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).send('Server error');
    }
};

const deleteOrder = async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            return res.status(404).send('Order not found');
        }
        res.redirect('/admin/orders');
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).send('Server error');
    }
};

// Search orders and users, and get total order count
const searchOrders = async (req, res) => {
    const query = req.query.q || ''; // Default to empty string if query is not provided

    try {
        // Log the search query for debugging
        console.log('Search Query:', query);

        // Create a regex query for string fields
        const regexQuery = new RegExp(query, 'i');

        // Fetch matching users based on first name, last name, or email
        const users = await User.find({
            $or: [
                { fName: regexQuery },
                { lName: regexQuery },
                { gmail: regexQuery }
            ]
        }).exec();

        // Log the users found
        console.log('Users Found:', users);

        // Extract user IDs from the fetched users
        const userIds = users.map(user => user._id);
        console.log('User IDs:', userIds);

        // Prepare search conditions for orders
        const orderConditions = [];

        // Check if the query is a valid ObjectId
        if (mongoose.Types.ObjectId.isValid(query)) {
            // Add condition to search by order ID
            orderConditions.push({ _id: query });
        }

        // If it's a valid date, add a condition to search by creation date
        if (!isNaN(new Date(query).getTime())) {
            orderConditions.push({ createdAt: { $gte: new Date(query) } });
        }

        // If query is not a valid ObjectId, search by user details and users found
        if (!mongoose.Types.ObjectId.isValid(query)) {
            orderConditions.push({ 'userDetails.fName': regexQuery });
            orderConditions.push({ 'userDetails.lName': regexQuery });
            orderConditions.push({ 'userDetails.gmail': regexQuery });
        }

        // Add condition to include orders from found users
        if (userIds.length > 0) {
            orderConditions.push({ user: { $in: userIds } });
        }

        // Fetch matching orders based on conditions
        const orders = await Order.find({ $or: orderConditions }).exec();

        // Log the orders found
        console.log('Orders Found:', orders);

        // Fetch total number of orders
        const totalOrders = await Order.countDocuments().exec();
        console.log('Total Orders Count:', totalOrders);

        // Render the view with data
        res.render('adminOrders', {
            users,
            orders,
            user: req.session.user,
            totalOrders
        });
    } catch (err) {
        // Log the error and render with error message
        console.error('Error in searchOrders:', err);
        res.render('adminOrders', {
            users: [],
            orders: [],
            user: req.session.user,
            totalOrders: 0,
            error: 'Failed to search users and orders: ' + err.message
        });
    }
};




module.exports = {
    renderEditOrderForm, 
    updateOrder,
    deleteOrder, 
    searchOrders,
    getOrderHistory
};