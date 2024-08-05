const mongoose = require('mongoose');
const { productsConnection } = require('../databases'); // import the existing products connection

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    supplier: {
        type: String,
        required: true
    },
    amount: {
        type: Number
    },
    sub: { 
        type: String, 
        required: false 
    },
    recommended: { 
        type: Boolean, 
       default:false 
    },
    kashrut: {
        type: String, 
        required: true
    },
    manufacturer:
    {
    type: String, 
    required: true
    }
});

//returns a model for a specific collection using the productSchema
//useful when have multiple collections with the same schema
function getProductModel(collectionName) {
    return productsConnection.model(collectionName, productSchema, collectionName);
}

module.exports = getProductModel;
