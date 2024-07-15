const { Double } = require('mongodb');
const mongoose = require('mongoose')

const schema = mongoose.schema; 

// Category Schema
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String
});

const Category = mongoose.model('Category', categorySchema);


let ProductSchema = new mongoose.Schema({

    title:{
        type: String,
        required:true
    }, 
    img: {
        type:String, 
        required:true
    },
    name: {
        type: String, 
        required: true
    },
    price:{
        type:Number, 
        required:true
    },
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category', 
        required: true 
    },// Reference to Category
    description: {
        type:String, 
        required:true

    },
    supplier: {
        type:String, 
        required:true
    }, 
    amount: {
        type:Number
    }
}); 

const Product = mongoose.model('Product', ProductSchema);

// Export the model
module.exports = { Product, Category };

