var express = require('express');
var router = express.Router();
const controller = require("../../controllers/qlts/CapPhat")
const formData = require("express-form-data")
const functions = require('../../services/functions');

router.post('/create',functions.checkToken,formData.parse(),controller.create)


router.post('/edit',functions.checkToken,formData.parse(),controller.edit)


router.post('/delete',functions.checkToken,formData.parse(),controller.delete)

router.post('/getList',functions.checkToken,formData.parse(),controller.getList)

router.post('/updateStatus',functions.checkToken,formData.parse(),controller.updateStatus)
module.exports = router