module.exports = (req, res, next) => {

    const is = (role) => {
        return req.session.user?.Role?.type === role;
    }

    res.locals.isLoggedIn = () => {
        return Boolean(req.session.user);
    }

    res.locals.is = is;

    res.locals.isAdmin = () => {
        return is('admin');
    }

    res.locals.isFormer = () => {
        return is('former');
    }

    res.locals.isStudent = () => {
        return is('student');
    }

    next();
}