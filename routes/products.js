const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Category = require('../models/category'); // Import the Category model
const Product = require('../models/product'); // Import the Category model
const getProductModel = require('../models/getProductModel'); // Import the generic model function

// Default route to handle the root URL
router.get('/', async (req, res) => {
    try {
        // Optionally, you can list all available collections or redirect to a specific collection
        const collections = await Category.find().exec();
        res.render('homePage', { collections });
    } catch (err) {
        console.log('Something went wrong with MongoDB:', err);
        res.status(500).send('Internal Server Error');
    }
});




// Route to display all products from a specific collection
router.get('/:collectionName', async (req, res) => {
    const { collectionName } = req.params;
    const ProductModel = getProductModel(collectionName);

    try {
        const docs = await ProductModel.find().exec();
        res.render('products', { Products: docs, collections: [], collectionName }); // Pass the fetched products and collection name
    } catch (err) {
        console.log('Something went wrong with MongoDB:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Route to add a product to a collection named after the product's category
router.post('/add', async (req, res) => {
    const { title, img, name, price, category, description, supplier, amount, sub } = req.body; // Include 'sub' if necessary

    console.log('Received data:', title, img, name, price, category, description, supplier, amount, sub);

    try {
        // Check if the category exists in the Category collection
        let existingCategory = await Category.findOne({ name: category });
        console.log(category);
        console.log(existingCategory);

        // If the category does not exist, create a new Category
        if (!existingCategory) {
            console.log('Category not found, creating new category:', category);
            existingCategory = await Category.create({ name: category });
        }

        // Create a new product instance using the category name as the collection name
        const ProductModel = getProductModel(category);

        // Create a new product instance
        const product = new ProductModel({
            title,
            img,
            name,
            price,
            category: existingCategory._id, // Use the ObjectId of the existing or new Category
            description,
            supplier,
            amount,
            sub // Include 'sub' if necessary
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
router.get('/edit/:collectionName/:id', async (req, res) => {
    const { collectionName, id } = req.params;
    const ProductModel = getProductModel(collectionName);

    try {
        const product = await ProductModel.findById(id).exec();
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.render('productsEdit', { Product: product });
    } catch (err) {
        console.log('Error retrieving data for editing:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Route to update a Product
router.post('/edit/:collectionName/:id', async (req, res) => {
    const { collectionName, id } = req.params;
    const ProductModel = getProductModel(collectionName);

    try {
        const updatedProduct = await ProductModel.findByIdAndUpdate(
            id,
            req.body,
            { new: true } // Returns the updated document
        ).exec();

        if (!updatedProduct) {
            return res.status(404).send('Product not found');
        }

        console.log('Updated successfully');
        res.redirect(`/${collectionName}`);
    } catch (err) {
        console.log('Something went wrong updating the data:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Route to delete a Product
router.get('/delete/:collectionName/:id', async (req, res) => {
    const { collectionName, id } = req.params;
    const ProductModel = getProductModel(collectionName);

    try {
        const deletedProduct = await ProductModel.findByIdAndDelete(id).exec();

        if (!deletedProduct) {
            return res.status(404).send('Product not found');
        }

        console.log('Deleted successfully');
        res.redirect(`/${collectionName}`);
    } catch (err) {
        console.log('Something went wrong deleting the data:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
