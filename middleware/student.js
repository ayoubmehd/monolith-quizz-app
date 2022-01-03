module.exports = (req, res, next) => {

    if (req.session.user?.Role?.type !== 'student') {
        res.redirect("/");
    }

    next();

}