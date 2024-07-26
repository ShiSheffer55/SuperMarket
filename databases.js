const mongoose = require('mongoose');

// MongoDB connection URIs
const usersMongoURI = 'mongodb+srv://noamlugassi1:2EzrVHzJKRznFVb6@cluster0.sgohd8f.mongodb.net/users?retryWrites=true&w=majority';
const productsMongoURI = 'mongodb+srv://noamlugassi1:2EzrVHzJKRznFVb6@cluster0.sgohd8f.mongodb.net/products?retryWrites=true&w=majority';

// Create connections
const usersConnection = mongoose.createConnection(usersMongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const productsConnection = mongoose.createConnection(productsMongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connect(productsMongoURI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    serverSelectionTimeoutMS: 30000  // Increase server selection timeout
});


// Event listeners for connection status
usersConnection.on('connected', () => {
    console.log('Users database connected');
});

productsConnection.on('connected', () => {
    console.log('Products database connected');
});

usersConnection.on('error', (err) => {
    console.error('Users database connection error:', err);
});

productsConnection.on('error', (err) => {
    console.error('Products database connection error:', err);
});

module.exports = {
    usersConnection,
    productsConnection
};
