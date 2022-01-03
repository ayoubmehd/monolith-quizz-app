var express = require('express');
var router = express.Router();

// const { auth, guest, admin, former, student } = require("./middleware");

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
