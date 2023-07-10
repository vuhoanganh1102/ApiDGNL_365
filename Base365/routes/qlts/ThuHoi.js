var express = require('express');
var router = express.Router();
const controller = require("../../controllers/qlts/ThuHoi")
const formData = require("express-form-data")
const functions = require('../../services/functions');

router.post('/create',functions.checkToken,formData.parse(),controller.create)


// router.post('/edit',functions.checkToken,formData.parse(),controller.edit)


// router.post('/delete',functions.checkToken,formData.parse(),controller.delete)

module.exports = router