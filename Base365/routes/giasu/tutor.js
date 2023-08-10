var express = require('express');
var router = express.Router();
const controller =  require('../../controllers/giasu/total');
const formData = require("express-form-data")
const functions = require('../../services/functions');

router.post('/addTutor',functions.checkToken,formData.parse(),controller.addTutor)


module.exports = router;