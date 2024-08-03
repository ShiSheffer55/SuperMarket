const mongoose = require('mongoose');

// MongoDB connection URIs
const usersMongoURI = 'mongodb+srv://noamlugassi1:2EzrVHzJKRznFVb6@cluster0.sgohd8f.mongodb.net/users?retryWrites=true&w=majority';
const productsMongoURI = 'mongodb+srv://noamlugassi1:2EzrVHzJKRznFVb6@cluster0.sgohd8f.mongodb.net/products?retryWrites=true&w=majority';
const locationsMongoURI = 'mongodb+srv://noamlugassi1:2EzrVHzJKRznFVb6@cluster0.sgohd8f.mongodb.net/locations?retryWrites=true&w=majority';
const ordersMongoURI = 'mongodb+srv://noamlugassi1:2EzrVHzJKRznFVb6@cluster0.sgohd8f.mongodb.net/orders?retryWrites=true&w=majority';

// Create connections
const usersConnection = mongoose.createConnection(usersMongoURI);
const productsConnection = mongoose.createConnection(productsMongoURI);
const locationsConnection = mongoose.createConnection(locationsMongoURI);
const ordersConnection = mongoose.createConnection(ordersMongoURI);

mongoose.connect(productsMongoURI, {
    serverSelectionTimeoutMS: 30000  // Increase server selection timeout
});

// Event listeners for connection status
usersConnection.on('connected', () => {
    console.log('Users database connected');
});

productsConnection.on('connected', () => {
    console.log('Products database connected');
});

locationsConnection.on('connected', () => {
    console.log('Locations database connected');
});

ordersConnection.on('connected', () => {
    console.log('Orders database connected');
});

usersConnection.on('error', (err) => {
    console.error('Users database connection error:', err);
});

productsConnection.on('error', (err) => {
    console.error('Products database connection error:', err);
});

locationsConnection.on('error', (err) => {
    console.error('Locations database connection error:', err);
});

ordersConnection.on('error', (err) => {
    console.error('Orders database connection error:', err);
});

module.exports = {
    usersConnection,
    productsConnection,
    locationsConnection,
    ordersConnection
};
