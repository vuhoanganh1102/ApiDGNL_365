var express = require('express');
var router = express.Router();
const controller =  require('../../controllers/giasu/updateInfoParent');
const formData = require("express-form-data")
const functions = require('../../services/functions');


router.post('/updateInfoParent',functions.checkToken, formData.parse(), controller.updateInfoParent);

module.exports = router;