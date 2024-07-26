const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        return next(); // User is an admin, proceed to the next middleware or route handler
    } else {
        req.flash('error_msg', 'You are not authorized to perform this action.');
        return res.redirect('/login'); // User is not an admin, redirect to login page
    }
};

module.exports = { isAdmin }; // Named export
