module.exports = (req, res, next) => {

    if (req.session.user?.Role?.type !== 'former') {
        res.redirect("/");
    }

    next();

}