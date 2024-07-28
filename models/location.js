const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { locationsConnection } = require('../databases'); // Import the locations connection

const locationSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});

locationSchema.index({ location: '2dsphere' });

module.exports = locationsConnection.model('Location', locationSchema);
