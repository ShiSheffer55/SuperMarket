const mongoose = require('mongoose');

// MongoDB connection
const productsMongoURI = 'mongodb+srv://noamlugassi1:2EzrVHzJKRznFVb6@cluster0.sgohd8f.mongodb.net/products?retryWrites=true&w=majority';
const usersMongoURI = 'mongodb+srv://noamlugassi1:2EzrVHzJKRznFVb6@cluster0.sgohd8f.mongodb.net/users?retryWrites=true&w=majority';

// Create connection for Products database
mongoose.connect(productsMongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Products database connected successfully'))
    .catch(err => console.error('Products database connection error:', err));

// Export the mongoose instance for product-related operations
const productsDb = mongoose.connection.useDb('products');

// Create connection for Users database
const usersDb = mongoose.createConnection(usersMongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

usersDb.once('open', () => {
    console.log('Users database connected successfully');
});

// Export the connections
module.exports = { productsDb, usersDb };
