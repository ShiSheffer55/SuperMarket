const User = require('../models/user'); 


const profile = async(req, res) => {
   console.log('User object:', req.session.user); // Check the structure and values here
    res.render('profile', { user: req.session.user });
};

module.exports = {
   profile
};