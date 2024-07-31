const mongoose = require('mongoose');
const Product = require('../models/product');
const Category = require('../models/category');
const getProductModel = require('../models/getProductModel');
const Fuse = require('fuse.js');

const searchProductsAcrossCollections = async (query) => {
    const collections = ['meat', 'fish', 'milk', 'fruits', 'vegetables', 'cleanliness', 'dry', 'sweets and snacks', 'drinks', 'frozen', 'Bread and pastries'];
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

    const productsMap = {};

    for (const category of matchedCategories) {
        const collection = await getProductModel(category);
        const foundProducts = await collection.find({}).exec();

        foundProducts.forEach(product => {
            product.collectionName = category;
            productsMap[product._id] = product;
        });
    }

    if (Object.keys(productsMap).length === 0) {
        for (const collectionName of collections) {
            const collection = await getProductModel(collectionName);
            const foundProducts = await collection.find({}).exec();

            foundProducts.forEach(product => {
                product.collectionName = collectionName;
                productsMap[product._id] = product;
            });
        }

        const options = {
            keys: ['name', 'title', 'sub'],
            threshold: 0.35,
            distance: 100
        };

        const results = Object.values(productsMap);

        const fuse = new Fuse(results, options);
        const searchResults = fuse.search(query);

        return searchResults.map(result => result.item);
    }

    return Object.values(productsMap);
};

const getKashrutOptionsFromProducts = (products) => {
    const kashrutSet = new Set();
    products.forEach(product => {
        if (product.kashrut) {
            kashrutSet.add(product.kashrut);
        }
    });
    return Array.from(kashrutSet);
};

const getManufacturersFromProducts = (products) => {
    const manufacturersSet = new Set();
    products.forEach(product => {
        if (product.manufacturer) {
            manufacturersSet.add(product.manufacturer);
        }
    });
    return Array.from(manufacturersSet);
};
const maxPricef = (products) => {
    max=-1;
    products.forEach(product => {
        let price = parseFloat(product.price);
        console.log(`Product price: ${price}`);
        console.log(max);
        if (product.price>max) {
            max=product.price;
        }
    });
    return max;
};
const minPricef = (products) => {
    min=Infinity;
    products.forEach(product => {
        let price = parseFloat(product.price);
        console.log(`Product price: ${price}`);
        if (product.price<min) {
            min=product.price;
        }
    });
    return min;
};
const searchProducts = async (req, res) => {
    try {
        const query = req.query.q || '';
        const minPrice = parseFloat(req.query.minPrice) || 0;
        const maxPrice = parseFloat(req.query.maxPrice) || Infinity;
        const kashrutFilters = req.query.kashrut || [];
        const manufacturerFilters = req.query.manufacturer || [];
                                     // checks if arr
        const kashrutFilterArray = Array.isArray(kashrutFilters) ? kashrutFilters : [kashrutFilters];
        const manufacturerFilterArray = Array.isArray(manufacturerFilters) ? manufacturerFilters : [manufacturerFilters];

        const products = await searchProductsAcrossCollections(query);

        const filteredProducts = products.filter(product => {
            const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
            const matchesKashrut = kashrutFilterArray.length === 0 || kashrutFilterArray.includes(product.kashrut); // checks if kashrut of product in the filters
            const matchesManufacturer = manufacturerFilterArray.length === 0 || manufacturerFilterArray.includes(product.manufacturer);// checks if manufacturer of product in the filters
            return matchesPrice && matchesKashrut && matchesManufacturer;
        });

        const kashrutOptions = getKashrutOptionsFromProducts(filteredProducts);
        const manufacturers = getManufacturersFromProducts(filteredProducts);
        const defaultMinPrice = Math.min(...products.map(product => product.price));
        const defaultMaxPrice = Math.max(...products.map(product => product.price));

        res.render('searchResult', {
            searchproducts: filteredProducts,
            kashrutOptions: kashrutOptions,
            manufacturers: manufacturers,
            query: query,
            maxPriceSlider: maxPrice,
            minPriceSlider: minPrice,
            defaultMinPrice: defaultMinPrice,
            defaultMaxPrice: defaultMaxPrice,
            selectedKashrut: kashrutFilterArray,
            selectedManufacturers: manufacturerFilterArray
        });
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).send('Internal Server Error');
    }
};


module.exports = { searchProducts };