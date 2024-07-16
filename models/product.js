const mongoose = require('mongoose');

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
    }
});

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
