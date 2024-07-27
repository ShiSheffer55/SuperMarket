const mongoose = require('mongoose');
const Product = require('../models/product');
const Category = require('../models/category');
const getProductModel = require('../models/getProductModel');
const Fuse = require('fuse.js');

const searchProductsAcrossCollections = async (query) => {
    const collections = ['meat', 'fish', 'milk', 'fruits', 'vegetables', 'cleanliness', 'dry', 'sweets and snacks', 'drinks', 'frozen', 'Bread and pastries'];
    let results = [];
    const categories = {
        meat: ['בשרים'],
        fish: ['דגים'],
        milk: ['מוצר חלב', 'מוצרי חלב', 'חלבי'],
        fruits: ['פרי', 'פירות'],
        vegetables: ['ירק', 'ירקות'],
        cleanliness: ['ניקיון', 'ניקיונות'],
        dry: ['יבשים'],
        'sweets and snacks': ['חטיפים וממתקים', 'ממתקים וחטיפים', 'חטיפים ומתוקים', 'מתוקים וחטיפים'],
        drinks: ['משקה', 'משקאות', 'שתייה', 'שתיה'],
        frozen: ['קפוא', 'קפואים'],
        'Bread and pastries': ['לחמים ומאפים', 'מאפים ולחמים']
    };

    // הכנת נתוני החיפוש ל-Fuse
    const fuseData = [];
    for (const [category, terms] of Object.entries(categories)) {
        terms.forEach(term => {
            fuseData.push({ category, term });
        });
    }

    const fuseOptions = {
        keys: ['term'],
        threshold: 0.2
    };

    const fuse = new Fuse(fuseData, fuseOptions);
    const categoryResults = fuse.search(query);
    const matchedCategories = categoryResults.map(result => result.item.category);

    // אובייקט לאחסון מוצרים על פי מזהה למניעת כפילויות
    const productsMap = {};

    // בדיקת התאמת קטגוריה
    for (const category of matchedCategories) {
        const collection = await getProductModel(category);
        const foundProducts = await collection.find({}).exec();

        // הוספת מוצרים למפה למניעת כפילויות
        foundProducts.forEach(product => {
            productsMap[product._id] = product;
        });
    }

    // אם לא נמצאו מוצרים מתאימים לפי קטגוריה, המשך חיפוש בכל הקולקציות
    if (Object.keys(productsMap).length === 0) {
        for (const collectionName of collections) {
            const collection = await getProductModel(collectionName);
            const foundProducts = await collection.find({}).exec();

            // הוספת מוצרים למפה למניעת כפילויות
            foundProducts.forEach(product => {
                productsMap[product._id] = product;
            });
        }

        // הגדרת אפשרויות החיפוש ב-Fuse.js
        const options = {
            keys: ['name', 'title', 'sub'],
            threshold: 0.35,
            distance: 100
        };

        // המרת המפה למערך
        results = Object.values(productsMap);

        // ביצוע החיפוש עם Fuse.js
        const fuse = new Fuse(results, options);
        const searchResults = fuse.search(query);

        return searchResults.map(result => result.item); // החזרת תוצאות החיפוש
    }

    // המרת המפה למערך
    results = Object.values(productsMap);

    return results; // החזרת מוצרים מהקטגוריות שנמצאו
};


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