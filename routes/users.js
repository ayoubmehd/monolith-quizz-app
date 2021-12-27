const sqrl = require("squirrelly");
const express = require('express');
const router = express.Router();


const repository = require("../repository/global");
const path = require("path");

const user = repository("User");
const role = repository("Role");

/* GET users listing. */
router.get('/', async function (req, res, next) {
    const [error, data] = await user.findAll({
        include: 'Role'
    });
    const [roleError, roleData] = await role.findAll();

    if (error) {
        res.status(error.code);
        next("route");
    }

    if (roleError) {
        res.status(roleError.code);
        next("route");
    }

    try {
        const compiled = await sqrl.renderFile(path.join(__dirname, "../views/ui/table/tbody.squirrelly"), { data })
            .then(compiled => sqrl.compile(compiled));

        sqrl.templates.define("tbody", compiled);

        res.render("users/index", { roles: roleData });
    } catch (err) {
        console.log(err);
    }
});

/* GET a single user. */
router.get('/:id/edit', async function (req, res, next) {
    // console.log(typeof req.params.id);

    const [error, data] = await user.findOne(req.params.id, {
        include: 'Role'
    });

    const [roleError, roleData] = await role.findAll();
    if (error) {
        res.status(error.code);
        res.send(error.message);
    }

    res.render('users/edit', { data, roles: roleData });
});

// Create a new user
router.post('/', async function (req, res, next) {

    const [error, data] = await user.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        RoleId: req.body.role,
    });

    if (error) {
        res.status(error.code);
        res.send(error.message);
    }

    res.locals.status = "success";
    res.locals.message = "User added successfuly";

    res.redirect("/users");

});

// Update a user
router.post('/:id/edit', async function (req, res, next) {

    const [error, data] = await user.update(req.params.id, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        RoleId: req.body.role,
    });

    if (error) {
        res.status(error.code);
        res.send(error.message);
    }

    res.redirect("/users");

});

// Delete a user
router.post('/:id/delete', async function (req, res, next) {
    const [error, data] = await user.destroy(req.params.id);

    if (error) {
        res.status(error.code);
        res.send(error.message);
    }

    res.redirect("/users");

});



module.exports = router;
