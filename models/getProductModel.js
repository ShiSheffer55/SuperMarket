const mongoose = require('mongoose');

// Singleton connection
const mongoURI = 'mongodb+srv://noamlugassi1:2EzrVHzJKRznFVb6@cluster0.sgohd8f.mongodb.net/products?retryWrites=true&w=majority';
const connection = mongoose.createConnection(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

connection.on('connected', () => {
    console.log('Connected to MongoDB');
});

connection.on('error', (err) => {
    console.error('Error connecting to MongoDB:', err);
});

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    img: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    sub: { type: String, required: true },
    supplier: { type: String, required: true },
    amount: { type: Number }
});

function getProductModel(collectionName) {
    return connection.model(collectionName, productSchema, collectionName);
}

module.exports = getProductModel;
