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

//only admin: 
const renderAddProductForm = (req, res) => {
    res.render('admin/addProduct', { user: req.session.user });
};

const addProduct = async (req, res) => {
    const { title, img, name, price, category, description, supplier, amount, recommended } = req.body;
    const Product = getProductModel(category); // Adjusted to get the correct model
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
        res.redirect(`/admin/${category}`); // Redirect back to the collection page
    } catch (err) {
        console.error('Error adding product:', err);
        res.redirect(`/admin/${category}?error=Failed to add product`);
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
        res.render('admin/productsEdit', { product, user: req.session.user });
    } catch (err) {
        console.error('Error fetching product:', err);
        res.redirect('/admin/products?error=Failed to fetch product');
    }
};

const updateProduct = async (req, res) => {
    const { collectionName, id } = req.params;
    const { title, img, name, price, category, description, supplier, amount, recommended } = req.body;
    const Product = getProductModel(collectionName);
    try {
        await Product.findByIdAndUpdate(id, {
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
        res.redirect('/admin/products?success=Product updated successfully');
    } catch (err) {
        console.error('Error updating product:', err);
        res.redirect(`/admin/products/edit/${collectionName}/${id}?error=Failed to update product`);
    }
};

const deleteProduct = async (req, res) => {
    const { collectionName, id } = req.params;
    const Product = getProductModel(collectionName);
    try {
        await Product.findByIdAndDelete(id);
        res.redirect('/admin/products?success=Product deleted successfully');
    } catch (err) {
        console.error('Error deleting product:', err);
        res.redirect('/admin/products?error=Failed to delete product');
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
};
