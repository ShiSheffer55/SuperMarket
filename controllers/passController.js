//Checking if a session user is admin
const isAdmin = (req, res, next) => {
    console.log('Checking if user is admin:', req.session.user);
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    } else {
        console.log('User is not authorized');
        req.flash('error_msg', 'You are not authorized to view this page');
        res.redirect('/users/login');
    }
};

//checking if a session user is Authenticated
const isUser = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    } else {
        return res.redirect('/users/login'); // User is not authenticated, redirect to login page
    }
};




module.exports = { 
    isAdmin,
    isUser
}; 
