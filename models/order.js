const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cart: { // הפניה למודל ה-Cart
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
        required: true
    },
    subTotal: {
        type: Number,
        default: 0
    },
    address: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', OrderSchema);
