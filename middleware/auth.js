
exports.auth = (req, res, next) => {
    if (!req.session.user) {
        res.redirect("/auth");
        res.end();
    }
    next();
}