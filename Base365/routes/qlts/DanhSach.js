var express = require('express');
var router = express.Router();
const controller = require("../../controllers/qlts/DanhSach")
const formData = require("express-form-data")
const functions = require('../../services/functions');
const fnc = require('../../services/QLTS/qltsService');

//page dieu chuyen vi tri 
router.post('/list_vitri', functions.checkToken, formData.parse(), controller.list_vitri);
router.post('/list_taisan', functions.checkToken, formData.parse(), controller.listTaiSan);
router.post('/chitiet_taisan', functions.checkToken, formData.parse(), controller.DetailTS);

// page bao duong - sua chua
router.post('/danhsach_taisan', functions.checkToken, formData.parse(), controller.listTS);
module.exports = router;