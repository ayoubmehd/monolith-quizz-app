const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

const repository = require("../repository/global");

const userRepository = repository("User");

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('auth/login');
});
router.post('/', async (req, res, next) => {

    if (req.session.user) {
        res.send("Alredy logged in");
        res.end();
        return;
    }

    const [err, user] = await userRepository.findAll({
        where: {
            email: req.body.email
        }
    });

    if (err) {
        res.send("User Dosn't exists");
        res.end();
        return;
    }

    if (user.length === 0) {
        res.send("User Dosn't exists it's me");
        res.end();
        return;
    }

    const isPasswordValide = await bcrypt.compare(req.body.password, user[0].password);

    if (!isPasswordValide) {
        res.send("User Dosn't exists");
        res.end();
        return;
    }

    req.session.user = user;

    res.send("User logged in")
    res.end();

});

router.get('/signup', (req, res, next) => {
    res.render('auth/signup', { title: 'Express' });
});

router.post('/signup', async (req, res, next) => {

    const payload = { ...req.body };

    // Confirmation
    if (payload.password !== payload.password_confirmation) {

        res.send(JSON.stringify({
            password_confirmation: "Pwassword donsn't match"
        }));

    }

    delete payload.password_confirmation

    const salt = await bcrypt.genSalt(10);

    payload.password = await bcrypt.hash(payload.password, salt);

    const [error, data] = await userRepository.create(payload);

    if (error) {
        res.status(error.code);
        res.send(error.message);
    }

    res.send(data);
    res.end();
});

module.exports = router;
