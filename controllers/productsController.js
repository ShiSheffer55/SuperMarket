const getProductModel = require('../models/getProductModel');
const Product = getProductModel('products'); 

const getRecommendedProducts = async (req, res) => {
    try {
        const ProductModel = getProductModel('recommended');
        const recommendedProducts = await ProductModel.find().exec();
        res.render('homePage', { recommendedProducts });
    } catch (err) {
        console.log('Error fetching recommended products:', err);
        res.status(500).send('Internal Server Error');
    }
};

// Get products from a specific collection
const getProductsFromCollection = async (req, res) => {
    const { collectionName } = req.params;
    const ProductModel = getProductModel(collectionName);

    try {
        const docs = await ProductModel.find().exec();
        res.render('products', { Products: docs, collectionName });
    } catch (err) {
        console.log('Something went wrong with MongoDB:', err);
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
const searchProducts = async (req, res) => {
    const query = req.query.q;
    try {
        const products = await Product.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        });
        res.render('admin/adminProducts', { products, user: req.session.user });
    } catch (err) {
        console.error('Error searching products:', err);
        req.flash('error_msg', 'Failed to search products');
        res.redirect('/admin/products');
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
    deleteProduct,
    searchProducts
};
