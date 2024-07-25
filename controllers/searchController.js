const mongoose = require('mongoose');
const Product = require('../models/product');
const Category = require('../models/category');
const getProductModel = require('../models/getProductModel');
const Fuse = require('fuse.js');

const searchProductsAcrossCollections = async (query) => {
    const collections = ['meat', 'fish', 'milk', 'fruits', 'vegetables', 'cleanliness', 'dry', 'sweets and snacks', 'drinks', 'frozen', 'Breads and pastries'];
    let results = [];

    for (const collectionName of collections) {
        const ProductModel = getProductModel(collectionName);
        try {
            const foundProducts = await ProductModel.find({}).exec();
            results = results.concat(foundProducts);
        } catch (err) {
            console.error(`Error fetching products from ${collectionName}:`, err);
        }
    }

    const options = {
        keys: ['name', 'title'],
        threshold: 0.3,
        distance: 100
    };

    const fuse = new Fuse(results, options);
    const searchResults = fuse.search(query);

    return searchResults.map(result => result.item);
};
  

// פונקציה לדוגמה ב-controller
const searchProducts = async (req, res) => {
    console.log('Search function called');
    const query = req.query.q; // The search term
  
    console.log('Search query:', query);
  
    if (!query) {
      return res.render('searchResult', { searchproducts: [], message: 'No search query provided.' });
    }
  
    try {
      const searchproducts = await searchProductsAcrossCollections(query);
      console.log('Search results:', searchproducts);
  
      if (searchproducts.length > 0) {
        res.render('searchResult', { searchproducts });
      } else {
        res.render('searchResult', { searchproducts: [], message: 'No products found matching your search.' });
      }
    } catch (err) {
      console.error('Error searching products:', err);
      res.status(500).send('Internal Server Error');
    }
  };

module.exports = { searchProducts };