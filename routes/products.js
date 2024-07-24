const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const getProductModel = require('../models/getProductModel');
const { isAdmin } = require('../controllers/passController');

// Route to show the location page
router.get('/location', (req, res) => {
    res.render('location'); 
});

// Route to show the registration page
router.get('/register', (req, res) => {
    res.render('register'); 
});

// Route to show the login page
router.get('/login', (req, res) => {
    res.render('login'); 
});



// Route to display recommended products on the homepage
router.get('/', async (req, res) => {
    try {
        const ProductModel = getProductModel('recommended');
        if (!ProductModel) {
            throw new Error('Product model is not defined');
        }
        const recommendedProducts = await ProductModel.find().exec();
        res.render('homePage', { recommendedProducts });
    } catch (err) {
        console.error('Error fetching recommended products:', err);
        res.status(500).send('Internal Server Error');
    }
});


// Route to show a form for adding a new product (admin only)
router.get('/add', isAdmin, (req, res) => {
    res.render('productsAdd');
});

// Route to handle form submission for adding a new product (admin only)
router.post('/add', isAdmin, async (req, res) => {
    const { title, img, name, price, category, sub, supplier, amount } = req.body;

    try {
        // Check if the category exists in the Category collection
        let existingCategory = await Category.findOne({ name: category });

        // If the category does not exist, create a new Category
        if (!existingCategory) {
            existingCategory = await Category.create({ name: category });
        }

        // Create a new product instance
        const product = new Product({
            title,
            img,
            name,
            price,
            category: existingCategory._id,
            sub,
            supplier,
            amount
        });

        // Save the product to the collection
        const savedProduct = await product.save();

        res.status(201).json({ product: savedProduct });
    } catch (err) {
        console.error('Error adding product:', err);
        res.status(500).json({ error: 'Error adding product', details: err.message });
    }
});

// Route to show a product for editing (admin only)
router.get('/edit/:id', isAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id).exec();
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.render('productsEdit', { Product: product });
    } catch (err) {
        console.error('Error retrieving product for editing:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Route to handle form submission for updating a product (admin only)
router.post('/edit/:id', isAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            req.body,
            { new: true } // Returns the updated document
        ).exec();

        if (!updatedProduct) {
            return res.status(404).send('Product not found');
        }

        res.redirect('/');
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Route to delete a product (admin only)
router.get('/delete/:id', isAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduct = await Product.findByIdAndDelete(id).exec();

        if (!deletedProduct) {
            return res.status(404).send('Product not found');
        }

        res.redirect('/');
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;