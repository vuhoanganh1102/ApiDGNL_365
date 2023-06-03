const router = require('express').Router();
const deXuatThanhToanRoute = require("../../../controllers/vanthu/DeXuat/DeXuatThanhToan")
const formData = require("express-form-data");

// thêm mới  De xuat thanh toan
router.post('/addDXTT',formData.parse(),deXuatThanhToanRoute.dxThanhToan)


module.exports = router