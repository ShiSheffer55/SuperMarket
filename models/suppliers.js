const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    name: { type: String, required: true },
    city: { type: String, required: true },
    categoryThatHeProvides: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    amount: { type: Number, required: true }
});


const supplier = mongoose.model('suppliers', supplierSchema);
module.exports = supplier;

