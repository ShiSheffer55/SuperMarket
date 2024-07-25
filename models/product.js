const mongoose = require('mongoose');
const { productsConnection } = require('../databases');

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
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }, // Reference to Category
    description: {
        type: String,
        required: true
    },
    supplier: {
        type: String,
        required: true
    },
    amount: {
        type: Number
    },
     // Remove or make optional if not used
     sub: { 
        type: String, 
        required: false 
    },
    recommended: { 
        type: Boolean, 
       default:false }
});


function getProductModel(collectionName) {
    return productsConnection.model('Product', ProductSchema, collectionName);
}

module.exports = getProductModel;