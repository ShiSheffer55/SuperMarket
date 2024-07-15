const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const productsRoute = require('./routes/products');

const app = express();
const port = 3000;

// MongoDB connection
const mongoURI = 'mongodb+srv://noamlugassi1:2EzrVHzJKRznFVb6@cluster0.sgohd8f.mongodb.net/products?retryWrites=true&w=majority';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.log('Database connection error:', err));

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true })); // To parse form data
app.use(express.json());

// Routes
app.use('/', productsRoute);

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

