const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const methodOverride = require('method-override');

const productsRoute = require('./routes/products');
const adminRoute = require('./routes/admin');
const usersRoute = require('./routes/users');

const app = express();
const port = 3000;

// MongoDB connection URIs
const productsMongoURI = 'mongodb+srv://noamlugassi1:2EzrVHzJKRznFVb6@cluster0.sgohd8f.mongodb.net/products?retryWrites=true&w=majority';
const usersMongoURI = 'mongodb+srv://noamlugassi1:2EzrVHzJKRznFVb6@cluster0.sgohd8f.mongodb.net/users?retryWrites=true&w=majority';

// Connect to the users database
mongoose.connect(usersMongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected to users database');
    })
    .catch(err => {
        console.error('MongoDB connection error to users database:', err);
    });

// Connect to the products database
const productsDb = mongoose.createConnection(productsMongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

productsDb.on('connected', () => {
    console.log('MongoDB connected to products database');
});

productsDb.on('error', (err) => {
    console.error('MongoDB connection error to products database:', err);
});

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
    store: MongoStore.create({ mongoUrl: usersMongoURI }),
    cookie: { secure: false } // Set to true if using HTTPS
}));
app.use(flash());

// Global variables for flash messages
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.session.user || null;
    next();
});

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', productsRoute);
app.use('/admin', adminRoute);
app.use('/users', usersRoute);

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
