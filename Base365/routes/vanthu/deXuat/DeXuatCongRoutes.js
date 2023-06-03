const router = require('express').Router();
const deXuatCongRoute = require("../../../controllers/vanthu/DeXuat/DeXuatCong")
const formData = require("express-form-data");

// thêm mới  De xuat Cong Cong
router.post('/addDXC',formData.parse(),deXuatCongRoute.dxCong)


module.exports = router