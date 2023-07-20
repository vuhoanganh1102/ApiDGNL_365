var express = require('express');
var router = express.Router();
const controller = require("../../controllers/qlts/thanhLyController")
const formData = require("express-form-data")
const functions = require('../../services/functions');

// tạo đề xuất tài sản thanh lý
router.post('/createLiquidationAssetProposal',functions.checkToken,formData.parse(),controller.createLiquidationAssetProposal)

// danh sách đề xuất tài sản thanh lý
router.post('/getDataLiquidationAssetProposal',functions.checkToken,formData.parse(),controller.getDataLiquidationAssetProposal)

module.exports = router