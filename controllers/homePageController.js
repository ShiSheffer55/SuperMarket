const homePage = (req, res) => {
    const cart = req.session.cart || []; // or fetch cart from a different source if not using session
    res.render('homePage', { cart, user: req.session.user });
};

module.exports = {
    homePage
};