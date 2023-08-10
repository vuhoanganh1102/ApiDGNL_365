var express = require('express');
var router = express.Router();
const controller =  require('../../controllers/giasu/postNews');
const formData = require("express-form-data")
const functions = require('../../services/functions');

//
router.post('/postFindTeacher',functions.checkToken, formData.parse(), controller.post);
//
// router.post('/detailParent',functions.checkToken, formData.parse(), controller.detailParent);


module.exports = router;