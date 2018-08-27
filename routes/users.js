var express = require('express');
var router = express.Router();

/* GET users.jade listing. */
router.get('/users', function(req, res, next) {
    res.send('My users');
});

module.exports = router;
