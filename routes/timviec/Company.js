var express = require('express');
var router = express.Router();
var auth = require('../../controllers/timviec/authCompany');

router.post('/register', auth.register);

module.exports = router;