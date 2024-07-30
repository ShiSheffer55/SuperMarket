const Order = require('../models/order');
const User = require('../models/user');

// Search orders and users, and get total order count
const searchOrders = async (req, res) => {
    const query = req.query.q || ''; // Default to empty string if query is not provided
    try {
        const users = await User.find({
            $or: [
                { userName: { $regex: query, $options: 'i' } },
                { fName: { $regex: query, $options: 'i' } },
                { lName: { $regex: query, $options: 'i' } },
                { gmail: { $regex: query, $options: 'i' } }
            ]
        });

        const orders = await Order.find({
            $or: [
                { _id: { $regex: query, $options: 'i' } },
                { createdAt: { $regex: query, $options: 'i' } }
            ]
        });

        const totalOrders = await Order.countDocuments();

        res.render('adminOrders', {
            users,
            orders,
            user: req.session.user,
            totalOrders // Ensure totalOrders is always included
        });
    } catch (err) {
        res.render('adminOrders', {
            users: [],
            orders: [], // Ensure orders is an empty array if there's an error
            user: req.session.user,
            totalOrders: 0, // Set default value for totalOrders
            error: 'Failed to search users and orders: ' + err.message
        });
    }
};

module.exports = {
    searchOrders
};
