var express = require('express');
var router = express.Router();
const formData = require('express-form-data');
const baoDuongController = require('../../../controllers/qlts/SuaChua_BaoDuong/BaoDuong/TaiSanCanBaoDuong');
const functions = require('../../../services/functions');
const qltsService = require('../../../services/QLTS/qltsService');

//lay ra danh sach 

router.post('/deleteBd',functions.checkToken,formData.parse(),baoDuongController.xoaBaoDuong)
// router.post('/danhSachBaoDuong', functions.checkToken, formData.parse(), baoDuongController.danhSachBaoDuong)
// //lay ra danh sach
// //router.post('/danhSachBaoDuong', functions.checkToken, formData.parse(), baoDuongController.danhSachBaoDuong)

module.exports = router;