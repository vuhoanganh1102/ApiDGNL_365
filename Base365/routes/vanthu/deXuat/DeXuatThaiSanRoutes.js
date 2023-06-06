const router = require('express').Router();
const deXuatThaiSanRoute = require("../../../controllers/vanthu/DeXuat/DeXuatThaiSan")
const formData = require("express-form-data");
const funtions = require('../../../services/functions');

//api thêm để xuất thai sản
router.post('/addDxTs',formData.parse(),funtions.checkToken,deXuatThaiSanRoute.dxThaiSan)


module.exports = router