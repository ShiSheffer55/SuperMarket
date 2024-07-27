const Cart = require('../models/cart');
const getProductModel = require('../models/product'); // Import the function

// Add item to cart
const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.session.user._id;
    const collectionName = req.session.params;

    console.log(collectionName);
    try {
        const Product = getProductModel(collectionName); // Instantiate the Product model
        let cart = await Cart.findOne({ user: userId });
        const product = await Product.findById(productId); // Use the instantiated model
        const total = product.price * quantity;

        if (!cart) {
            cart = new Cart({
                user: userId,
                items: [{ productId, quantity, price: product.price, total }],
                subTotal: total
            });
        } else {
            const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));
            if (itemIndex > -1) {
                let item = cart.items[itemIndex];
                item.quantity += parseInt(quantity);
                item.total = item.quantity * product.price;
            } else {
                cart.items.push({ productId, quantity, price: product.price, total });
            }
            cart.subTotal += total;
        }

        await cart.save();
        res.redirect('/cart');
    } catch (err) {
        console.error('Error adding to cart:', err);
        res.status(500).send('Internal Server Error');
    }
};

// View cart
const viewCart = async (req, res) => {
    const collectionName = req.session.params;
    const Product = getProductModel(collectionName); // Instantiate the Product model

    try {
        const cart = await Cart.findOne({ user: req.session.user._id }).populate({
            path: 'items.productId',
            model: Product // Use the instantiated model
        });
        res.render('cart', { cart });
    } catch (err) {
        console.error('Error fetching cart:', err);
        res.status(500).send('Internal Server Error');
    }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
    const { productId } = req.body;
    const userId = req.session.user._id;
    const collectionName = req.session.params;

    try {
        let cart = await Cart.findOne({ user: userId });
        const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));

        if (itemIndex > -1) {
            let item = cart.items[itemIndex];
            cart.subTotal -= item.total;
            cart.items.splice(itemIndex, 1);
            await cart.save();
        }

        res.redirect('/cart');
    } catch (err) {
        console.error('Error removing from cart:', err);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    addToCart,
    viewCart,
    removeFromCart
};
