const Order = require('../../models/order');
//Order order
exports.getOrders = async (req, res) => {
    try {
        const userId = req.params.userId;
        const orders = await Order.find({ userId }).populate('items.productId').exec();
        res.render('orders', { orders });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'שגיאה בקבלת ההזמנות');
        res.redirect('/');
    }
};
