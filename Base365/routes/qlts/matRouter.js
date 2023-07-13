var express = require('express');
var router = express.Router();
const controller = require("../../controllers/qlts/matController")
const formData = require("express-form-data")
const functions = require('../../services/functions');

// danh sách tài sản báo mất
router.post('/getListDataLostAssets',formData.parse(),functions.checkToken,controller.getListDataLostAssets)



module.exports = router