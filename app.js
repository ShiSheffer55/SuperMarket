//node js is a runtime environment allowing you to execute JavaScript code on the server side, outside a web browser
const express = require('express');//allowing us to use features such as api and body-parser
const path = require('path');
const mongoose = require('mongoose');//connecting to a library of mongodb called mongoose
const session = require('express-session');//allowing the creation and storage of the session data used for authentication and user checks
const MongoStore = require('connect-mongo');//connectiong mongo
const flash = require('connect-flash');//allows to render a pop-up message whenever a user is redirected to a particular webpage
const methodOverride = require('method-override');//allows to use methods such as POST
require('dotenv').config();//allows us to use .env file and keeps security

//API keys
const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY; //maps
const openWeatherApiKey = process.env.OPENWEATHER_API_KEY;//weather

//routes:
const searchRoute = require('./routes/search');
const productsRoute = require('./routes/products');
const adminRoute = require('./routes/admin');
const usersRoute = require('./routes/users');
const cartRoute = require('./routes/cart');
const locationsRoute = require('./routes/location'); 
const profileRoute = require('./routes/profile');
const historyRoute = require('./routes/history');
const ordersRoute = require('./routes/orders'); 

//declaring the connections to the databases (users, products, locations, orders)
const { usersConnection, productsConnection, locationsConnection, ordersConnection } = require('./databases'); // Import connections

//use express 
const app = express();
const port = 3002;

// Set view engine to EJS (dont have to use .ejs if rendering)
app.set('view engine', 'ejs');
//define the path /views
app.set('views', path.join(__dirname, 'views'));
app.use('/views', express.static(path.join(__dirname, '/views')));

// Middleware
app.use(express.urlencoded({ extended: true }));// allows for objects and arrays to be encoded into the URL-encoded format.
app.use(express.json());//divide incoming requests with JSON
app.use(methodOverride('_method'));
app.use(session({
    secret: process.env.SESSION_SECRET,//secret key to manage cookies and keep privecy 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://noamlugassi1:2EzrVHzJKRznFVb6@cluster0.sgohd8f.mongodb.net/users?retryWrites=true&w=majority' })
}));

//use flash 
app.use(flash());

// Global variables for flash messages 
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.session.user || null; //allows to check if a user is logged in by checking user in the locals.
    res.locals.cart = req.session.cart || [];//allows to access the user's shopping cart using cart in the locals.
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

// Start server on the given port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
