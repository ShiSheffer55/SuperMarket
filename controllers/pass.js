// // scripts/promoteToAdmin.js

// const mongoose = require('mongoose');
// const User = require('../models/user'); 

// const mongoURI = 'mongodb://localhost:27017/users'; 

// mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(async () => {
//         console.log('Database connected successfully');
//         // Find the user by userName or another unique field
//         const user = await User.findOne({ userName: 'someUserName' }); // Replace with the actual user identifier
//         if (user) {
//             user.role = 'admin'; // Update the role to admin
//             await user.save();
//             console.log('User promoted to admin successfully');
//         } else {
//             console.log('User not found');
//         }
//         mongoose.connection.close();
//     })
//     .catch(err => {
//         console.error('Database connection error:', err);
//     });
