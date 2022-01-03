module.exports = (...roles) => {
    return (req, res, next) => {

        if (roles.includes(req.session.user?.Role?.type)) {
            return next();
        }

        res.redirect("/");

    }
}