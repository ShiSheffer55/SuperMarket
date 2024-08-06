const mongoose = require('mongoose');//השורה הזו מייבאת את הספרייה Mongoose ומאחסנת אותה במשתנה mongoose.
const Schema = mongoose.Schema;//השורה הזו מייבאת את אובייקט ה-Schema מתוך הספרייה Mongoose ומאחסנת אותו במשתנה Schema. 

const ItemSchema = new Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity cannot be less than 1.']
    },
    price: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const CartSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [ItemSchema],
    subTotal: {
        type: Number,
        default: 0
    }
    }, 
    {
    timestamps: true
    });

module.exports = mongoose.model('Cart', CartSchema);
