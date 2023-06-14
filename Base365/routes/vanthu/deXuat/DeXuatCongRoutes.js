const router = require('express').Router();
const deXuatCongRoute = require("../../../controllers/vanthu/DeXuat/DeXuatCong")
const formData = require("express-form-data");
const functions = require("../../../services/functions");

// thêm mới  De xuat Cong Cong
router.post('/addDXC',functions.checkToken,formData.parse(),deXuatCongRoute.dxCong);

// Sua de xuat cong cong

// router.put('/editDXC',formData.parse().deXuatCongRoute.updateCong)


module.exports = router