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

module.exports = (collectionName) => {
    return mongoose.model(collectionName, productSchema, collectionName);
};
