const getProductModel = require('../models/getProductModel');
const Product = getProductModel('products'); 

const getRecommendedProducts = async (req, res) => {
    try {
        const collections = ['frozen', 'sweets and snacks','milk', 'fruits', 'vegetables', 'drinks','Bread and pastries', 'dry','cleanliness',  'meat', 'fish']; // Replace with your actual collection names
        let recommendedProducts = [];

        for (const collectionName of collections) {
            const collection = await getProductModel(collectionName);
            const foundProducts = await collection.find({ recommended: true }).exec();
            console.log(`Found ${foundProducts.length} products in ${collectionName}`);
            recommendedProducts = recommendedProducts.concat(foundProducts);
        }

        console.log(recommendedProducts.length);
        res.render('homePage.ejs', { recommendedProducts });
    } catch (err) {
        console.log('Error fetching recommended products:', err);
        res.status(500).send('Internal Server Error');
    }
};

// Get products from a specific collection
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
        console.log(`Fetching products from ${collectionName} collection...`);
        const products = await ProductModel.find().exec();
        console.log(`${collectionName} products fetched successfully.`);
        const collectionNameHebrew = categoryNames[collectionName];

        res.render('products', { Products: products, collectionName: collectionNameHebrew });
    } catch (err) {
        console.error(`Error retrieving products from ${collectionName} collection:`, err);
        res.status(500).send('Internal Server Error');
    }
};

// Render the form to add a product
const renderAddProductForm = (req, res) => {
    res.render('admin/addProduct', { user: req.session.user });
};

// Add a new product (admin only)
const addProduct = async (req, res) => {
    const { title, img, name, price, category, description, supplier, amount } = req.body;
    try {
        const newProduct = new Product({
            title,
            img,
            name,
            price,
            category,
            description,
            supplier,
            amount,
            recommended
        });
        await newProduct.save();
        req.flash('success_msg', 'Product added successfully');
        res.redirect('/admin/products');
    } catch (err) {
        console.error('Error adding product:', err);
        req.flash('error_msg', 'Failed to add product');
        res.redirect('/admin/products/add');
    }
};

// Render the form to edit a product
const renderEditProductForm = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            req.flash('error_msg', 'Product not found');
            return res.redirect('/admin/products');
        }
        res.render('admin/editProduct', { product, user: req.session.user });
    } catch (err) {
        console.error('Error fetching product:', err);
        req.flash('error_msg', 'Failed to fetch product');
        res.redirect('/admin/products');
    }
};

// Update a product (admin only)
const updateProduct = async (req, res) => {
    const { title, img, name, price, category, description, supplier, amount } = req.body;
    try {
        await Product.findByIdAndUpdate(req.params.id, {
            title,
            img,
            name,
            price,
            category,
            description,
            supplier,
            amount
        });
        req.flash('success_msg', 'Product updated successfully');
        res.redirect('/admin/products');
    } catch (err) {
        console.error('Error updating product:', err);
        req.flash('error_msg', 'Failed to update product');
        res.redirect(`/admin/products/edit/${req.params.id}`);
    }
};

// Handle deleting a product
const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        req.flash('success_msg', 'Product deleted successfully');
        res.redirect('/admin/products');
    } catch (err) {
        console.error('Error deleting product:', err);
        req.flash('error_msg', 'Failed to delete product');
        res.redirect('/admin/products');
    }
};

// Handle searching products


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
