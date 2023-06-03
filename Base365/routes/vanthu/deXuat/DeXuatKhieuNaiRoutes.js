const router = require('express').Router();
const deXuatKhieuNaiRoute = require("../../../controllers/vanthu/DeXuat/DeXuatKhieuNai")
const formData = require("express-form-data");

// thêm mới  De xuat Cong Cong
router.post('/addDXKN',formData.parse(),deXuatKhieuNaiRoute.dxKhieuNai)


module.exports = router