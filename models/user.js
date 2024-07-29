const mongoose = require('mongoose');
const { usersConnection } = require('../databases');


const userSchema = new mongoose.Schema({
    userName: { 
        type: String, 
        required: true, 
        unique: true 
    },
    fName: {
        type: String, 
        required: true
    },
    lName: {
        type: String, 
        required: true
    },
    password: { 
        type: String, 
        required: true 
    },
    gmail: {
        type: String, 
        required: true 
    },
    tel: {
        type: String, 
        required: true 
    },
    city: {
        type: String, 
        required: true 
    },
    isLivesInCenter: {
        type: Boolean
    },
    role: { 
        type: String, 
        enum: ['user', 'admin'], 
        default: 'user'
    }
});
const User = usersConnection.model('User', userSchema);
module.exports = User;