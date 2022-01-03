module.exports = (req, res, next) => {
    console.log(req.session?.user.Role);
    if (req.sessio?.user?.Role?.type !== 'admin') {
        return res.redirect("/");
    }

    next();

}