const express = require('express');
const router = express.Router();

const repository = require("../repository/global");

const user = repository("User");

/* GET users listing. */
router.get('/', async function (req, res, next) {
    const [error, data] = await user.findAll();

    if (error) {
        res.status(error.code);
        res.send(error.message);
    }

    res.send(data);
});

/* GET a single user. */
router.get('/:id', async function (req, res, next) {
    const [error, data] = await user.findOne(req.params.id);

    if (error) {
        res.status(error.code);
        res.send(error.message);
    }

    res.send(data);
});

// Create a new user
router.post('/', async function (req, res, next) {

    const [error, data] = await user.create(req.body);

    if (error) {
        res.status(error.code);
        res.send(error.message);
    }

    res.send(data);

});

// Update a user
router.patch('/:id', async function (req, res, next) {

    const [error, data] = await user.update(req.params.id, req.body);

    if (error) {
        res.status(error.code);
        res.send(error.message);
    }

    res.send(data);

});

// Delete a user
router.delete('/:id', async function (req, res, next) {
    const [error, data] = await user.destroy(req.params.id);

    if (error) {
        res.status(error.code);
        res.send(error.message);
    }

    res.send(data);

});



module.exports = router;
