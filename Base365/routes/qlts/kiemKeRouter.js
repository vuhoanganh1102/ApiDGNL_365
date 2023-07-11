var express = require('express');
var router = express.Router();
const formData = require('express-form-data');
const functions = require('../../services/functions');
const kiemKeController = require('../../controllers/qlts/kiemKeController');

router.post('/create', formData.parse(), functions.checkToken, kiemKeController.create);

module.exports = router;