const getProductModel = require('../models/product');
const Product = getProductModel('products'); // Default model for products


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
        const collections = ['frozen', 'sweets and snacks','milk', 'fruits', 'vegetables',  'drinks', 'Breads and pastries','cleanliness', 'dry','meat', 'fish']; // Replace with your actual collection names
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
        console.error('Error fetching recommended products:', err);
        res.status(500).send('Internal Server Error');
    }
}
// Get products from a specific collection
exports.getProductsFromCollection = async (req, res) => {
    const collectionName = req.params.collectionName; // Get collection name from route parameter
    const ProductModel = getProductModel(collectionName);

    try {
        const Products = await ProductModel.find({});
        if (Products.length > 0) {
            res.render('products', { Products, collectionName });
        } else {
            res.render('products', { message: `No products found in ${collectionName}.`, collectionName });
        }
    } catch (err) {
        console.error(`Error fetching products from ${collectionName}:`, err);
        res.status(500).send('Internal Server Error');
    }
};

// Render form to add a product (admin only)
exports.renderAddProductForm = (req, res) => {
    res.render('addProduct');
};

// Add a new product (admin only)
exports.addProduct = async (req, res) => {
    const { title, img, name, price, category, description, supplier, amount, recommended } = req.body;
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
            recommended //
        });
        await newProduct.save();
        req.flash('success_msg', 'Product added successfully');
        res.redirect('/products');
    } catch (err) {
        console.error('Error adding product:', err);
        req.flash('error_msg', 'Failed to add product');
        res.redirect('/products/add');
    }
};

// Render form to edit a product (admin only)
exports.renderEditProductForm = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.render('editProduct', { product });
    } catch (err) {
        console.error('Error fetching product:', err);
        res.status(500).send('Internal Server Error');
    }
};

// Update a product (admin only)
exports.updateProduct = async (req, res) => {
    const { title, img, name, price, category, description, supplier, amount, recommended } = req.body;
    try {
        await Product.findByIdAndUpdate(req.params.id, {
            title,
            img,
            name,
            price,
            category,
            description,
            supplier,
            amount,
            recommended //
        });
        req.flash('success_msg', 'Product updated successfully');
        res.redirect('/products');
    } catch (err) {
        console.error('Error updating product:', err);
        req.flash('error_msg', 'Failed to update product');
        res.redirect(`/products/edit/${req.params.id}`);
    }
};

// Delete a product (admin only)
exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        req.flash('success_msg', 'Product deleted successfully');
        res.redirect('/products');
    } catch (err) {
        console.error('Error deleting product:', err);
        req.flash('error_msg', 'Failed to delete product');
        res.redirect('/products');
    }
};

