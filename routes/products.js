const express = require('express');
const router = express.Router();
const { isAdmin } = require('../controllers/passController');
const {
    getAllProducts,
    renderAddProductForm,
    addProduct,
    renderEditProductForm,
    updateProduct,
    deleteProduct,
    getRecommendedProducts,
    getProductsFromCollection
} = require('../controllers/productsController');

// Route to view all the recommended products (accessible to all users)
router.get('/', getRecommendedProducts);

// Route to get products from a specific collection
router.get('/:collectionName', getProductsFromCollection);

// Route to add a product (admin only)
router.get('/add', isAdmin, renderAddProductForm);
router.post('/add', isAdmin, addProduct);

// Route to edit a product (admin only)
router.get('/edit/:id', isAdmin, renderEditProductForm);
router.post('/edit/:id', isAdmin, updateProduct);

// Route to delete a product (admin only)
router.post('/delete/:id', isAdmin, deleteProduct);

module.exports = router;