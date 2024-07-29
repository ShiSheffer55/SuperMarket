const getProductModel = require('../models/getProductModel');
const Order = require('../models/order');

const addToCart = async (req, res) => {
    const { productId, quantity, category } = req.body;
    const productModel = getProductModel(category);

    console.log(req.body);
    try {
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).send('Product not found');
        }

        if (!req.session.cart) {
            req.session.cart = [];
        }

        const cartItemIndex = req.session.cart.findIndex(item => item.productId === productId);
        if (cartItemIndex > -1) {
            req.session.cart[cartItemIndex].quantity += parseInt(quantity);
        } else {
            req.session.cart.push({
                productId: product._id,
                title: product.title,
                price: product.price,
                quantity: parseInt(quantity),
                img: product.img
            });
        }

        res.redirect('/cart');
    } catch (err) {
        console.error('Error adding product to cart:', err);
        res.status(500).send('Internal Server Error');
    }
};

const viewCart = (req, res) => {
    res.render('cart', { cart: req.session.cart || [] });
};

const checkout = (req, res) => {
    const cart = req.session.cart || [];
    if (cart.length === 0) {
        return res.redirect('/cart');
    }
    res.render('checkout', { cart, user: req.session.user });
};

const placeOrder = async (req, res) => {
    const cart = req.session.cart || [];
    if (cart.length === 0) {
        return res.redirect('/cart');
    }

    try {
        const order = new Order({
            user: req.session.user._id,
            products: cart,
            total: cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
        });

        await order.save();
        req.session.cart = []; // Clear the cart after placing the order
        res.render('orderSuccess');
    } catch (err) {
        console.error('Error placing order:', err);
        res.status(500).send('Internal Server Error');
    }
};


const getOrderHistory = async (req, res) => {
    try {
        const orders = await Order.find().populate('userId').populate('products.productId').exec();
        res.render('orderHistory', { orders });
    } catch (err) {
        console.error('Error fetching order history:', err);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    addToCart,
    viewCart,
    checkout,
    placeOrder,
    getOrderHistory
};
