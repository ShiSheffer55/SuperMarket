const getProductModel = require('../models/product');

exports.getRecommendedProducts = async (req, res) => {
    const Recommended = getProductModel('recommended'); // Use the 'recommended' collection

    try {
        const recommendedProducts = await Recommended.find({});
        if (recommendedProducts.length > 0) {
            res.render('homePage', { recommendedProducts });
        } else {
            res.render('homePage', { message: 'No recommended products found.' });
        }
    } catch (err) {
        console.error('Error fetching recommended products:', err);
        res.status(500).send('Internal Server Error');
    }
};


exports.getProductsFromCollection = async (req, res) => {
    const collectionName = req.params.collectionName; // Get collection name from route parameter
    const ProductModel = getProductModel(collectionName);

    try {
        const Products = await ProductModel.find({});
        if (Products.length > 0) {
            res.render('products', { Products, collectionName });
        } else {
            res.render('products', { message: `No products found in ${collectionName}.`, collectionName });
        }
    } catch (err) {
        console.error(`Error fetching products from ${collectionName}:`, err);
        res.status(500).send('Internal Server Error');
    }
};