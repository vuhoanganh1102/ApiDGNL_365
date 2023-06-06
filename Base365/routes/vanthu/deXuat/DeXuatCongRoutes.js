const router = require('express').Router();
const deXuatCongRoute = require("../../../controllers/vanthu/DeXuat/DeXuatCong")
const formData = require("express-form-data");

// thêm mới  De xuat Cong Cong
router.post('/addDXC',formData.parse(),deXuatCongRoute.dxCong);

// Sua de xuat cong cong

router.put('/editDXC',formData.parse().deXuatCongRoute.updateCong)


module.exports = router