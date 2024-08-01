const mongoose = require('mongoose');
const getProductModel = require('../models/getProductModel');
const Product = getProductModel('products'); 

const categoryMap = {
    'בשר': 'meat',
    'דגים': 'fish',
    'מוצרי חלב': 'milk',
    'פירות': 'fruits',
    'ירקות': 'vegetables',
    'ניקיון': 'cleanliness',
    'יבשים': 'dry',
    'ממתקים וחטיפים': 'sweets and snacks',
    'משקאות': 'drinks',
    'קפואים': 'frozen',
    'לחמים ומאפים': 'Bread and pastries'
};

const getRecommendedProducts = async (req, res) => {
    try {
        const collections = ['frozen', 'sweets and snacks','milk', 'fruits', 'vegetables', 'drinks','Bread and pastries', 'dry','cleanliness',  'meat', 'fish']; // Replace with your actual collection names
        let recommendedProducts = [];

        for (const collectionName of collections) {
            const collection = await getProductModel(collectionName);
            const foundProducts = await collection.find({ recommended: true }).exec();
            console.log(`Found ${foundProducts.length} products in ${collectionName}`);

            // Attach the collection name to each product
            foundProducts.forEach(product => product.collectionName = collectionName);

            recommendedProducts = recommendedProducts.concat(foundProducts);
        }

        console.log(recommendedProducts.length);
        res.render('homePage.ejs', { recommendedProducts });
    } catch (err) {
        console.log('Error fetching recommended products:', err);
        res.status(500).send('Internal Server Error');
    }
};

const getProductsFromCollection = async (req, res) => {
    const { collectionName } = req.params;
    const categoryNames = {
        meat: 'בשר',
        fish: 'דגים',
        milk: 'מוצרי חלב',
        fruits: 'פירות',
        vegetables: 'ירקות',
        cleanliness: 'ניקיון',
        dry: ' יבשים',
        'sweets and snacks': 'ממתקים וחטיפים',
        drinks: 'משקאות',
        frozen: 'קפואים',
        'Bread and pastries': 'לחמים ומאפים'
    };
    try {
        const ProductModel = getProductModel(collectionName);
        const products = await ProductModel.find().exec();
        const collectionNameHebrew = categoryNames[collectionName];

        // Attach the collection name to each product
        products.forEach(product => {
            product.collectionName = collectionName;
        });

        const cart = req.session.cart || []; // Or fetch cart from a different source if not using session
        res.render('products', { Products: products, collectionName: collectionName,collectionNameHebrew: collectionNameHebrew, cart, user: req.session.user });
    } catch (err) {
        console.error(`Error retrieving products from ${collectionName} collection:`, err);
        res.status(500).send('Internal Server Error');
    }
};



//only admin: 
const renderAddProductForm = (req, res) => {
    res.render('admin/addProduct', { user: req.session.user });
};

//working
const addProduct = async (req, res) => {
    const { title, img, name, price, category, sub, supplier, amount, recommended, kashrut, manufacturer } = req.body;
    const collectionName = categoryMap[category]; // Convert Hebrew category to English collection name
    console.log('category:', category);
    console.log(collectionName);
    console.log(category);
    if (!collectionName) {
        return res.status(400).send('Invalid category');
    }

    const isRecommended = recommended === 'כן'; // Convert "כן" to true and "לא" to false

    try {
        const Product = getProductModel(collectionName); // Get the correct model based on the collection name
        const newProduct = new Product({
            title,
            img,
            name,
            price,
            sub,
            supplier,
            amount,
            recommended: isRecommended,
            kashrut,
            manufacturer 
        });
        await newProduct.save();
        res.redirect(`/${collectionName}`); // Redirect back to the collection page
    } catch (err) {
        console.error('Error adding product:', err);
        res.redirect(`/${collectionName}?error=Failed to add product`);
    }
};

const renderEditProductForm = async (req, res) => {
    const { collectionName, id } = req.params;
    const Product = getProductModel(collectionName);
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.redirect('/admin/products?error=Product not found');
        }
        res.render('productsEdit', {
            product,
            user: req.session.user,
            categoryMap, // העברת categoryMap לתצוגה
            collectionName // הוסף את collectionName להצגה
        });
    } catch (err) {
        console.error('Error fetching product:', err);
        res.redirect('/admin/products?error=Failed to fetch product');
    }
};

//working
const updateProduct = async (req, res) => {
    const { collectionName, id } = req.params;
    const { title, img, name, price, category, sub, supplier, amount, recommended, kashrut, manufacturer } = req.body;
    const isRecommended = recommended === 'כן';

    console.log('collectionName:', collectionName);
    console.log('category:', category);
    const Category = categoryMap[category];
    const Product = getProductModel(collectionName);
    console.log('Product:', Product);

    // קבל את המודל הנוכחי
    try {
        // מחק את המוצר מהקטגוריה הנוכחית
        await Product.findByIdAndDelete(id);

        // עדכן את המידע בקטגוריה החדשה
        const NewProductModel = getProductModel(Category);
        const newProduct = new NewProductModel({
            title,
            img,
            name,
            price,
            sub,
            supplier,
            amount,
            recommended: isRecommended,
            kashrut,
            manufacturer
        });

        await newProduct.save();
        res.redirect(`/${collectionName}`); // Redirect back to the collection page
    } catch (err) {
        console.error('Error updating product:', err);
        res.redirect(`/${collectionName}/${id}?error=Failed to update product`);
    }
};



const deleteProduct = async (req, res) => {
    const { collectionName, id } = req.params;
    const Product = getProductModel(collectionName);
    try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ message: 'Failed to delete product' });
    }
};





// Export all functions at the end
module.exports = {
    getRecommendedProducts,
    getProductsFromCollection,
    renderAddProductForm,
    addProduct,
    renderEditProductForm,
    updateProduct,
    deleteProduct
};
