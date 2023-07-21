var express = require('express');
var router = express.Router();
const controller = require("../../controllers/qlts/matController");
const formData = require("express-form-data");
const functions = require('../../services/functions');
const qltsService = require('../../services/QLTS/qltsService');

//tài sản báo mất
router.post('/getListDataLostAssets', functions.checkToken, qltsService.getDataFromToken, formData.parse(), controller.getListDataLostAssets);

router.post('/createMat', functions.checkToken, qltsService.getDataFromToken, formData.parse(), controller.createMat);

router.post('/deleteMat', functions.checkToken, qltsService.getDataFromToken, formData.parse(), controller.deleteMat);

router.post('/duyet', functions.checkToken, qltsService.getDataFromToken, formData.parse(), controller.duyet);

router.post('/tuChoi', functions.checkToken, qltsService.getDataFromToken, formData.parse(), controller.tuChoi);

router.post('/hoanThanh', functions.checkToken, qltsService.getDataFromToken, formData.parse(), controller.hoanThanh);


module.exports = router