const express = require('express');
const router = express.Router();
const { isAdmin } = require('../controllers/passController');
const getProductModel = require('../models/getProductModel');

// Admin dashboard
router.get('/', isAdmin, (req, res) => {
    res.render('admin/dashboard');
});

// Admin route to edit products
router.get('/edit/:collectionName/:id', isAdmin, async (req, res) => {
    const { collectionName, id } = req.params;
    const ProductModel = getProductModel(collectionName);

    try {
        const product = await ProductModel.findById(id).exec();
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.render('productsEdit', { Product: product, collectionName: collectionName });
    } catch (err) {
        console.log('Error retrieving data for editing:', err);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/edit/:collectionName/:id', isAdmin, async (req, res) => {
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
        res.redirect(`/products/${collectionName}`);
    } catch (err) {
        console.log('Something went wrong updating the data:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
