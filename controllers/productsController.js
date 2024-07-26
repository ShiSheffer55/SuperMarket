const getProductModel = require('../models/getProductModel');
const Product = getProductModel('products'); 

// Get recommended products
// exports.getRecommendedProducts = async (req, res) => {
//     const Recommended = getProductModel('recommended'); // Use the 'recommended' collection

//     try {
//         const recommendedProducts = await Recommended.find({});
//         if (recommendedProducts.length > 0) {
//             res.render('homePage', { recommendedProducts });
//         } else {
//             res.render('homePage', { message: 'No recommended products found.' });
//         }
//     } catch (err) {
//         console.error('Error fetching recommended products:', err);
//         res.status(500).send('Internal Server Error');
//     }
// };
exports.getRecommendedProducts = async (req, res) => {
    try {
        const collections = ['meat', 'fish', 'milk', 'fruits', 'vegetables', 'cleanliness', 'dry', 'sweets and snacks', 'drinks', 'frozen', 'Breads and pastries']; // Replace with your actual collection names
        let recommendedProducts = [];

        for (const collectionName of collections) {
            const collection = await getProductModel(collectionName);
            const foundProducts = await collection.find({recommended: true}).exec();
            console.log(`Found ${foundProducts.length} products in ${collectionName}`);
            recommendedProducts  = recommendedProducts .concat(foundProducts);
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
    try {
        const ProductModel = getProductModel(collectionName);
        console.log(`Fetching products from ${collectionName} collection...`);
        const products = await ProductModel.find().exec();
        console.log(`${collectionName} products fetched successfully.`);
        res.render('products', { Products: products, collectionName });
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
exports.addProduct = async (req, res) => {
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
            recommended: recommended === 'on'
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
exports.updateProduct = async (req, res) => {
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
