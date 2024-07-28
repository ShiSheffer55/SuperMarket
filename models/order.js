const mongoose = require('mongoose');
const { ordersConnection } = require('../databases');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    products: [
        {
            productId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Product', 
                required: true 
            },

            title: String,
            price: Number,
            quantity: Number,
            img: String
        }
    ],
    total: { 
        type: Number, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

const Order = ordersConnection.model('Order', orderSchema);

module.exports = Order;
