const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const methodOverride = require('method-override');
require('dotenv').config();

// עכשיו תוכל להשתמש במפתחי ה-API שלך
const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
const searchRoute = require('./routes/search');
const productsRoute = require('./routes/products');
const adminRoute = require('./routes/admin');
const usersRoute = require('./routes/users');
const cartRoute = require('./routes/cart');
const locationsRoute = require('./routes/location'); 
const profileRoute = require('./routes/profile');
const historyRoute = require('./routes/history');
const ordersRoute = require('./routes/orders'); 

const { usersConnection, productsConnection, locationsConnection } = require('./databases'); // Import connections

const app = express();
const port = 3001;

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/views', express.static(path.join(__dirname, '/views')));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://noamlugassi1:2EzrVHzJKRznFVb6@cluster0.sgohd8f.mongodb.net/users?retryWrites=true&w=majority' })
}));
app.use(flash());

// Global variables for flash messages
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.session.user || null;
    res.locals.cart = req.session.cart || [];
    next();
});

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/admin', adminRoute);
app.use('/cart', cartRoute);
app.use('/profile', profileRoute);
app.use('/search', searchRoute);
app.use('/', productsRoute);
app.use('/users', usersRoute);
app.use('/location', locationsRoute);
app.use('/history', historyRoute); 
app.use('/orders', ordersRoute);

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
