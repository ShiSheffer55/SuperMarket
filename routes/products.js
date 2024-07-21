const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Category = require('../models/category'); // Import Category model
const getProductModel = require('../models/getProductModel'); // Import dynamic model function
const { isAdmin } = require('../controllers/passController'); // Import admin check middleware

// Route to display recommended products on the homepage
router.get('/', async (req, res) => {
    try {
        const ProductModel = getProductModel('recommended');
        const recommendedProducts = await ProductModel.find().exec();
        res.render('homePage', { recommendedProducts });
    } catch (err) {
        console.log('Error fetching recommended products:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Route to display all products from a specific collection
router.get('/:collectionName', async (req, res) => {
    const { collectionName } = req.params;
    const ProductModel = getProductModel(collectionName);
    try {
        const products = await ProductModel.find().exec();
        res.render('products', { Products: products, collectionName });
    } catch (err) {
        console.log('Error retrieving products:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Route to show a form for adding a new product (admin only)
router.get('/add', isAdmin, (req, res) => {
    res.render('productsAdd');
});

// Route to handle form submission for adding a new product (admin only)
router.post('/add', isAdmin, async (req, res) => {
    const { title, img, name, price, category, description, supplier, amount } = req.body;
    try {
        let existingCategory = await Category.findOne({ name: category });
        if (!existingCategory) {
            existingCategory = await Category.create({ name: category });
        }
        
        const savedProduct = await product.save();
        res.status(201).json({ product: savedProduct });
    } catch (err) {
        console.error('Error adding product:', err);
        res.status(500).json({ error: 'Error adding product', details: err.message });
    }
});

// Route to show a product for editing (admin only)
router.get('/edit/:collectionName/:id', isAdmin, async (req, res) => {
    const { collectionName, id } = req.params;
    const ProductModel = getProductModel(collectionName);
    try {
        const product = await ProductModel.findById(id).exec();
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.render('productsEdit', { Product: product, collectionName });
    } catch (err) {
        console.log('Error retrieving product for editing:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Route to handle form submission for updating a product (admin only)
router.post('/edit/:collectionName/:id', isAdmin, async (req, res) => {
    const { collectionName, id } = req.params;
    const ProductModel = getProductModel(collectionName);
    try {
        const updatedProduct = await ProductModel.findByIdAndUpdate(id, req.body, { new: true }).exec();
        if (!updatedProduct) {
            return res.status(404).send('Product not found');
        }
        res.redirect(`/${collectionName}`);
    } catch (err) {
        console.log('Error updating product:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Route to delete a product (admin only)
router.get('/delete/:collectionName/:id', isAdmin, async (req, res) => {
    const { collectionName, id } = req.params;
    const ProductModel = getProductModel(collectionName);
    try {
        const deletedProduct = await ProductModel.findByIdAndDelete(id).exec();
        if (!deletedProduct) {
            return res.status(404).send('Product not found');
        }
        res.redirect(`/${collectionName}`);
    } catch (err) {
        console.log('Error deleting product:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
