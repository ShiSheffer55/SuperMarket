const getProductModel = require('../models/getProductModel');
const Order = require('../models/order');

const addToCart = async (req, res) => {
    const { productId, quantity, category } = req.body;

    // Ensure that all required fields are present
    if (!productId || !quantity || !category) {
        return res.status(400).json({ message: 'Product ID, quantity, and category are required' });
    }

    console.log('Request body:', req.body);

    try {
        // Get the product model based on the category
        const Product = getProductModel(category);

        // Check if the Product model was successfully retrieved
        if (!Product) {
            console.error('Invalid category:', category);
            return res.status(400).json({ message: 'Invalid category' });
        }

        // Fetch the product from the database
        const product = await Product.findById(productId);

        if (!product) {
            console.error('Product not found:', productId);
            return res.status(404).json({ message: 'Product not found' });
        }

        const quantityInt = parseInt(quantity, 10);
        console.log('Parsed quantity:', quantityInt);

        // Check if there's enough stock
        if (product.amount < quantityInt) {
            console.error('Not enough stock available for product:', productId);
            return res.status(400).json({ message: 'Not enough stock available' });
        }

        // Update the product quantity in the database
        product.amount -= quantityInt;
        await product.save();
        console.log('Updated product amount:', product.amount);

        // Add the product to the cart (assuming req.session.cart is an array)
        let cart = req.session.cart || [];
        const cartItem = cart.find(item => item._id === productId && item.category === category);

        if (cartItem) {
            cartItem.quantity += quantityInt;
        } else {
            cart.push({
                _id: product._id,
                title: product.title,
                img: product.img,
                price: product.price,
                quantity: quantityInt,
                category: category // Include the category in the cart item
            });
        }

        req.session.cart = cart;
        console.log('Updated cart:', req.session.cart);

        return res.status(200).json({ 
            cart: req.session.cart, 
            message: 'Product added to cart successfully', 
            newAmount: product.amount // Return the new amount of the product
        });
    } catch (err) {
        console.error('Internal server error:', err);
        return res.status(500).json({ message: 'Internal server error' });
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

const emptyCart = async (req, res) => {
    req.session.cart = [];
    res.json({ message: 'הסל התבטל' });
}


// Remove a product from the cart
const removeProductFromCart = async (req, res) => {
    const productName = decodeURIComponent(req.params.name); // Decode the product name if needed
    console.log('Removing product with name:', productName);

    // Retrieve the cart from the session
    let cart = req.session.cart || [];
    console.log('Current cart:', cart);

    // Find the item to remove from the cart
    const itemToRemove = cart.find(item => item.title === productName);

    if (!itemToRemove) {
        console.log('Product not found in cart');
        return res.status(404).json({ message: 'Product not found in cart' });
    }

    // Get the product category from the item to use for model lookup
    const productCategory = itemToRemove.category; // Ensure `category` is properly set in the cart item
    console.log(productCategory); 
    const Product = getProductModel(productCategory); // Get model based on category

    try {
        // Fetch the product from the database
        const product = await Product.findOne({ title: productName });

        if (!product) {
            console.log('Product not found in database');
            return res.status(404).json({ message: 'Product not found in database' });
        }

        // Update the product amount in the database
        product.amount += itemToRemove.quantity;
        await product.save();

        // Remove the product from the cart
        cart = cart.filter(item => item.title !== productName);
        req.session.cart = cart;

        console.log('Updated cart:', cart);
        res.json({ 
            message: 'Product removed successfully', 
            cart: req.session.cart 
        });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = {
    addToCart,
    viewCart,
    checkout,
    placeOrder, 
    emptyCart,
    removeProductFromCart
};
