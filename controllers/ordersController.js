const Order = require('../models/order');
const User = require('../models/user');

// פונקציה להציג את היסטוריית ההזמנות
const getOrderHistory = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.userId });
        if (!orders || orders.length === 0) {
            return res.status(404).send('No orders found for this user');
        }
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
    renderEditOrderForm, 
    updateOrder,
    deleteOrder, 
    searchOrders,
    getOrderHistory
};