const mongoose = require('mongoose');
const Product = require('../models/product');
const Category = require('../models/category');
const getProductModel = require('../models/getProductModel');

const searchProductsAcrossCollections = async (query) => {
    const collections = ['meat', 'fish', 'milk', 'fruits', 'vegetables', 'cleanliness', 'dry', 'sweets and snacks', 'drinks', 'frozen', 'Breads and pastries'];
    let results = [];

    for (const collectionName of collections) {
        const collection = await getProductModel(collectionName);
        const foundProducts = await collection.find({ name: { $regex: query, $options: 'i' } }).exec();
        results = results.concat(foundProducts);
    }

    return results;
};

// דוגמה לפעולה ב-controller
const searchProducts = async (req, res) => {
    console.log('im in');
    const query = req.query.q; // המילה שהמשתמש חיפש
    try {
        const searchproducts = await searchProductsAcrossCollections(query);
        res.render('searchResult.ejs', { searchproducts });
    } catch (err) {
        console.log('Error searching products:', err);
        res.status(500).send('Internal Server Error');
    }
};


module.exports = { searchProducts };