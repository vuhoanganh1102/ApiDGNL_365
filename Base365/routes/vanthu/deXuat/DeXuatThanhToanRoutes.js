const router = require('express').Router();
const deXuatThanhToanRoute = require("../../../controllers/vanthu/DeXuat/DeXuatThanhToan")
const formData = require("express-form-data");
const funtions = require('../../../services/functions');

// thêm mới  De xuat thanh toan
router.post('/addDXTT',formData.parse(),funtions.checkToken,deXuatThanhToanRoute.dxThanhToan)


module.exports = router