const profile = (req, res) => {
    console.log(req.session.user.gmail);
   // const cart = req.session.cart || []; // or fetch cart from a different source if not using session
    res.render('profile', {user: req.session.user });
};

module.exports = {
   profile
};