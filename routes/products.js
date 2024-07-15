const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Category, Product } = require('../models/product'); 

// Route to display all products
router.get('/', async (req, res) => {
    try {
        const docs = await Product.find().exec();
        res.render('products', { Products: docs }); 
    } catch (err) {
        console.log('Something went wrong with MongoDB:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Route to add a product to a collection named after the product's category
router.post('/add', async (req, res) => {
    const { title, img, name, price, category, description, supplier, amount } = req.body;

    try {
        // Check if all required fields are provided
        if (!title || !img || !name || !price || !category || !description || !supplier) {
            return res.status(400).json({ error: 'All fields (title, img, name, price, category, description, supplier) are required' });
        }

        // Validate that category is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(category)) {
            return res.status(400).json({ error: 'Invalid category ID format' });
        }

        // Check if the category exists
        const existingCategory = await Category.findById(category);
        if (!existingCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Dynamically create a model for the product collection named after the category
        const ProductModel = mongoose.model(existingCategory.name, new mongoose.Schema({
            title: { type: String, required: true },
            img: { type: String, required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
            description: { type: String, required: true },
            supplier: { type: String, required: true },
            amount: { type: Number }
        }));

        // Create a new product instance
        const product = new ProductModel({
            title,
            img,
            name,
            price,
            category,
            description,
            supplier,
            amount
        });

        // Save the product to the dynamically named collection
        const savedProduct = await product.save();

        res.status(201).json({ product: savedProduct });
    } catch (err) {
        console.error('Error adding product:', err);
        res.status(500).json({ error: 'Error adding product', details: err.message });
    }
});


// Route to show a Product for editing
router.get('/edit/:id', async (req, res) => {
    try {
        
        const Product = await Product.findById(req.params.id).exec();
        if (!Product) {
            console.log('Product not found');
        }
        else{
            res.render('productsEdit', { Product });

        }
    } catch (err) {
        console.log('Error retrieving data for editing:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Route to update a Product
router.post('/edit/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // Returns the updated document
        ).exec();

        if (!updatedProduct) {
            return res.status(404).send('Product not found');
        }

        console.log('Updated successfully');
        res.redirect('/');
    } catch (err) {
        console.log('Something went wrong updating the data:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Route to delete a Product
router.get('/delete/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id).exec();

        if (!deletedProduct) {
            return res.status(404).send('Product not found');
        }

        console.log('Deleted successfully');
        res.redirect('/');
    } catch (err) {
        console.log('Something went wrong deleting the data:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
