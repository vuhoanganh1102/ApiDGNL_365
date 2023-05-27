const express = require('express');
var router = express.Router();
const formData = require('express-form-data');
const fnc = require('../../services/functions');
const com = require('../../controllers/raonhanh365');


router.post('/comInfo', fnc.checkToken, com.comInfo);

module.exports = router;