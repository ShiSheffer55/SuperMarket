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
            orders,  // Pass orders to the template
            user: req.session.user,
            totalOrders
        });
    } catch (err) {
        res.render('adminOrders', {
            users: [],
            orders: [],  // Ensure orders is an empty array if there's an error
            user: req.session.user,
            totalOrders: 0,
            error: 'Failed to search users and orders: ' + err.message
        });
    }
};

module.exports = {
    searchOrders
};
