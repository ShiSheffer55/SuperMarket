const express = require('express');
const router = express.Router();
const { isAdmin } = require('../controllers/passController');
const adminController = require('../controllers/adminController');
const userController = require('../controllers/usersController');
const productsController = require('../controllers/productsController');

// Admin Dashboard
router.get('/adminDashboard', isAdmin, adminController.showAdminDashboard);

// Products Routes
router.get('/products/add', isAdmin, productsController.renderAddProductForm);
router.post('/products/add', isAdmin, productsController.addProduct);
router.get('/products/edit/:id', isAdmin, productsController.renderEditProductForm);
router.post('/products/edit/:id', isAdmin, productsController.updateProduct);
router.post('/products/delete/:id', isAdmin, productsController.deleteProduct);


// Users Routes
router.get('/users/add', isAdmin, userController.renderAddUserForm);
router.post('/users/add', isAdmin, userController.addUser);
router.get('/users/edit/:id', isAdmin, userController.renderEditUserForm);
router.post('/users/edit/:id', isAdmin, userController.updateUser);
router.post('/users/delete/:id', isAdmin, userController.deleteUser);
router.get('/users/search', isAdmin, userController.searchUsers);

// Orders Routes (Admin only)
// Uncomment and adjust if needed
// router.get('/orders', isAdmin, adminController.renderAdminOrders); 
// router.get('/orders/add', isAdmin, orderController.renderAddOrderForm);
// router.post('/orders/add', isAdmin, orderController.addOrder); 
// router.get('/orders/edit/:id', isAdmin, orderController.renderEditOrderForm); 
// router.post('/orders/edit/:id', isAdmin, orderController.updateOrder);
// router.post('/orders/delete/:id', isAdmin, orderController.deleteOrder); 
// router.get('/orders/search', isAdmin, orderController.searchOrders); 

module.exports = router;
