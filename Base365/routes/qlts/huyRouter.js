var express = require('express');
var router = express.Router();
const controller = require("../../controllers/qlts/huyController")
const formData = require("express-form-data")
const functions = require('../../services/functions');

// danh sách tài sản đề xuất huỷ
router.post('/getDataAssetProposeCancel',functions.checkToken,formData.parse(),controller.getDataAssetProposeCancel)



module.exports = router