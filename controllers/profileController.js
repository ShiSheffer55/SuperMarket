const User = require('../models/user'); 


const profile = (req, res) => {
   if (req.session.user) {
       res.render('profile', { user: req.session.user });
   } else {
       res.redirect('/users/login');
   }
};


module.exports = {
   profile
};