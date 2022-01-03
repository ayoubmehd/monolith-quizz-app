module.exports = (req, res, next) => {

    if (req.sessio?.user?.Role?.type !== 'admin') {
        return res.redirect("/");
    }

    next();

}