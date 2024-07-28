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

const ensureAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next(); // User is authenticated, proceed to the next middleware or route handler
    } else {
        return res.redirect('/users/login'); // User is not authenticated, redirect to login page
    }
};


const isUser = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    } else {
        res.redirect('/users/login');
    }
};

module.exports = { 
    isAdmin,
    ensureAuthenticated,
    isUser
 }; 
