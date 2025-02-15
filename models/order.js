const mongoose = require('mongoose');
const { ordersConnection } = require('../databases');

const orderSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        refPath: 'User',  // Directly referencing the User model
        required: true 
    },
    userDetails: {
        fName: { type: String, required: true },
        lName: { type: String, required: true },
        gmail: { type: String, required: true }
    },
    products: [
        {
            productId: { 
                type: mongoose.Schema.Types.ObjectId, 
                refPath: 'Product',  // Directly referencing the Product model
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
    },
    status: {  // Added a status field for the order
        type: String,
        default: 'Pending'
    }
});
orderSchema.pre('save', function(next) {
    const timezoneOffset = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

    if (this.isNew) {
        this.createdAt = new Date(this.createdAt.getTime() + timezoneOffset);
    }
  
    next();
});
const Order = ordersConnection.model('Order', orderSchema);

module.exports = Order;
