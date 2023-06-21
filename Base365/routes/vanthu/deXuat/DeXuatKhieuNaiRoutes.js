const router = require('express').Router();
const deXuatKhieuNaiRoute = require("../../../controllers/vanthu/DeXuat/DeXuatKhieuNai")
const formData = require("express-form-data");
const funtions = require('../../../services/functions');
// thêm mới  De xuat Cong Cong
router.post('/addDXKN',funtions.checkToken,formData.parse(),deXuatKhieuNaiRoute.dxKhieuNai)


module.exports = router