module.exports.isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    } else {
        req.flash('error_msg', 'You are not authorized to perform this action.');
        res.redirect('/');
    }
};
