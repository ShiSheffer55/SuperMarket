const mongoose = require('mongoose');
const Product = require('../models/product');
const Category = require('../models/category');
const getProductModel = require('../models/getProductModel');
const Fuse = require('fuse.js');

const searchProductsAcrossCollections = async (query) => {
    const collections = ['meat', 'fish', 'milk', 'fruits', 'vegetables', 'cleanliness', 'dry', 'sweets and snacks', 'drinks', 'frozen', 'Breads and pastries'];
    let results = [];

    for (const collectionName of collections) {
        const collection = await getProductModel(collectionName);
        const foundProducts = await collection.find({}).exec();
        results = results.concat(foundProducts);
    }

    const options = {
        keys: ['name', 'title'], // השדות לחיפוש בהם
        threshold: 0.3, // מדרגת דיוק לחיפוש (0.0 עד 1.0)
        distance: 100 // מקסימום מרחק לחיפוש 
    };

    const fuse = new Fuse(results, options);
    const searchResults = fuse.search(query);

    return searchResults.map(result => result.item);
};

// פונקציה לדוגמה ב-controller
const searchProducts = async (req, res) => {
    console.log('im in');
    const query = req.query.q; // המילה שהמשתמש חיפש
    try {
        const searchproducts = await searchProductsAcrossCollections(query);
        res.render('searchResult.ejs', { searchproducts});
    } catch (err) {
        console.log('Error searching products:', err);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = { searchProducts };