// routes/admin.js
const express = require('express');
const router = express.Router();
const { isAdmin } = require('../controllers/passController');
const adminController = require('../controllers/adminController');
const productsController = require('../controllers/productsController');
const usersController = require('../controllers/usersController');
const orderController = require('../controllers/ordersController');

// Admin dashboard
router.get('/dashboard', isAdmin, adminController.showAdminDashboard);

// Manage Users
router.get('/users', isAdmin, adminController.renderAdminUsers);
router.get('/users/add', isAdmin, usersController.renderAddUserForm);
router.post('/users/add', isAdmin, usersController.addUser);
router.get('/users/edit/:id', isAdmin, usersController.renderEditUserForm);
router.post('/users/edit/:id', isAdmin, usersController.updateUser);
router.post('/users/delete/:id', isAdmin, usersController.deleteUser);
router.get('/users/search', isAdmin, usersController.searchUsers);


// Manage Orders
router.get('/orders', isAdmin, adminController.renderAdminOrders);
// Route to get the average orders per month data
router.get('/orders/per-day', isAdmin, adminController.getOrdersPerDay); 
router.get('/orders/searchOrders', isAdmin, orderController.searchOrders); 
// Edit Order
router.get('/orders/edit/:id', isAdmin, orderController.renderEditOrderForm);
router.post('/orders/edit/:id', isAdmin, orderController.updateOrder);
// Delete Order
router.post('/orders/delete/:id', isAdmin, orderController.deleteOrder);  


// Manage Products
router.get('/products', isAdmin, adminController.renderAdminProducts);
router.get('/products/add', isAdmin, productsController.renderAddProductForm);
router.post('/products/add', isAdmin, productsController.addProduct);
router.get('/products/edit/:collectionName/:id', isAdmin, productsController.renderEditProductForm);
router.post('/products/edit/:collectionName/:id', isAdmin, productsController.updateProduct);
router.delete('/products/delete/:collectionName/:id', isAdmin, productsController.deleteProduct);
router.get('/:collectionName', isAdmin, productsController.getProductsFromCollection);


module.exports = router;
