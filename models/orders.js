const mongoose = require('mongoose');

const ordersSchema = new mongoose.Schema({
    idOfUser: { type: String, required: true },
    city: {type: String, required: true},
    Street: {type: String, required: true},
    HouseNumber: {type: Number, required: true},
    ApartmentNumber: {type: Number, required: true},
    tel: {type: Number, required: true},
    gmail: { type: String, required: true },
    price: { type: Number, required: true },
    CouponCode: {type: String},//הרקוויר אומר אם זה שדה חובה או לא

    //להוסיף שדה של כל המוצרים של ההזמנה הספציפית
});


const Order = mongoose.model('Orders', ordersSchema);
module.exports = Order;