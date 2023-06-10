const router = require('express').Router();
const deXuatThaiSanRoute = require("../../../controllers/vanthu/DeXuat/DeXuatThaiSan")
const formData = require("express-form-data");

//api thêm để xuất thai sản
router.post('/addDxTs',formData.parse(),deXuatThaiSanRoute.dxThaiSan)


module.exports = router