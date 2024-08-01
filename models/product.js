const mongoose = require('mongoose');
const { productsConnection } = require('../databases');
const { type } = require('os');

const ProductSchema = new mongoose.Schema({
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
       default:false },
    kashrut:
    {
        type: String, 
        required: true
    },
    manufacturer:
    {
    type: String, 
    required: true
    }
});


function getProductModel(collectionName) {
    return productsConnection.model('Product', ProductSchema, collectionName);
}

module.exports = getProductModel;