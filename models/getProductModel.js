const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    img: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    sub: { type: String, required: true },
    supplier: { type: String, required: true },
    amount: { type: Number }
});


function getProductModel(collectionName) {
    const productsMongoURI = 'mongodb+srv://noamlugassi1:2EzrVHzJKRznFVb6@cluster0.sgohd8f.mongodb.net/products?retryWrites=true&w=majority';
    const connection = mongoose.createConnection(productsMongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    
    connection.on('connected', () => {
        console.log(`Connected to ${collectionName} collection in products database.`);
    });

    connection.on('error', (err) => {
        console.error(`Error connecting to ${collectionName} collection in products database:`, err);
    });

    return connection.model(collectionName, productSchema);
}

module.exports = getProductModel;
