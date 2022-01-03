const bcrypt = require('bcrypt');
const express = require('express');
const db = require('../models');
const router = express.Router();

const repository = require("../repository/global");

const userRepository = repository("User");

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('auth/login');
});
router.post('/', async (req, res, next) => {

    const [err, user] = await userRepository.findAll({
        where: {
            email: req.body.email
        },
        include: db.sequelize.models.Role
    });

    if (err) {
        res.send("User Dosn't exists");
        return;
    }

    if (user.length === 0) {
        res.send("User Dosn't exists it's me");
        return;
    }

    console.log(req.body, user[0].password);

    const isPasswordValide = await bcrypt.compare(req.body.password, user[0].password);

    if (!isPasswordValide) {
        res.send("User Dosn't exists");
        return;
    }

    req.session.user = user[0];

    res.redirect("/");

});

router.get('/signup', (req, res, next) => {
    res.render('auth/signup', { title: 'Express' });
});

router.post("/logout", (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            res.redirect("/");
        }

        res.redirect("/login");
    })
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
