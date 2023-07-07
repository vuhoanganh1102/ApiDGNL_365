var express = require('express');
var router = express.Router();
const controller = require("../../controllers/qlts/CapPhat")
const formData = require("express-form-data")
const functions = require('../../services/functions');



router.post('/createDep',functions.checkToken,formData.parse(),controller.createAllocationDep)

module.exports = router