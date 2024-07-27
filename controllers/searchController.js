const mongoose = require('mongoose');
const Product = require('../models/product');
const Category = require('../models/category');
const getProductModel = require('../models/getProductModel');
const Fuse = require('fuse.js');

const searchProductsAcrossCollections = async (query) => {
    const collections = ['meat', 'fish', 'milk', 'fruits', 'vegetables', 'cleanliness', 'dry', 'sweets and snacks', 'drinks', 'frozen', 'Bread and pastries'];
    let results = [];
    const categories = {
        meat: ['בשר', 'בשרים'],
        fish: ['דג', 'דגים'],
        milk: ['מוצר חלב', 'מוצרי חלב','חלבי'],
        fruits: ['פרי', 'פירות'],
        vegetables: ['ירק', 'ירקות'],
        cleanliness: ['ניקיון', 'ניקיונות'],
        dry: ['יבש', 'יבשים'],
        'sweets and snacks': ['חטיפים וממתקים', 'ממתקים וחטיפים', 'חטיפים ומתוקים','מתוקים וחטיפים'],
        drinks: ['משקה', 'משקאות', 'שתייה', 'שתיה'],
        frozen: ['קפוא', 'קפואים'],
        'Bread and pastries': ['לחמים ומאפים','מאפים ולחמים']
    };

    // בדיקת התאמת קטגוריה
    for (const category in categories) {
        const lowerCaseQuery = query.toLowerCase();
        const categoryTerms = categories[category].map(term => term.toLowerCase());

        if (categoryTerms.some(term => lowerCaseQuery.includes(term)) || lowerCaseQuery.includes(category)) {
            const collection = await getProductModel(category);
            const foundProducts = await collection.find({}).exec();
            results = results.concat(foundProducts); // הוספת מוצרים מהקטגוריה המתאימה
        }
    }

    // אם לא נמצאו מוצרים מתאימים לפי קטגוריה, המשך חיפוש בכל הקולקציות
    if (results.length === 0) {
        for (const collectionName of collections) {
            const collection = await getProductModel(collectionName);
            const foundProducts = await collection.find({}).exec();
            results = results.concat(foundProducts);
        }

        // הגדרת אפשרויות החיפוש ב-Fuse.js
        const options = {
            keys: ['name', 'title', 'sub'], // השדות לחיפוש בהם
            threshold: 0.35, // מדרגת דיוק לחיפוש (0.0 עד 1.0)
            distance: 100 // מקסימום מרחק לחיפוש 
        };

        // ביצוע החיפוש עם Fuse.js
        const fuse = new Fuse(results, options);
        const searchResults = fuse.search(query);

        return searchResults.map(result => result.item); // החזרת תוצאות החיפוש
    }

    return results; // החזרת מוצרים מהקטגוריות שנמצאו
};

// פונקציה לדוגמה ב-controller
const searchProducts = async (req, res) => {
    console.log('im in');
    const query = req.query.q; // המילה שהמשתמש חיפש
    try {
        const searchproducts = await searchProductsAcrossCollections(query);
        res.render('searchResult.ejs', { searchproducts, query});
    } catch (err) {
        console.log('Error searching products:', err);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = { searchProducts };