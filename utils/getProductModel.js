const mongoose = require('mongoose');

const getProductModel = (categoryName) => {
    const schema = new mongoose.Schema({
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

    // Use Mongoose's model function to either retrieve an existing model or create a new one
    return mongoose.model(categoryName, schema);
};

module.exports = getProductModel;
