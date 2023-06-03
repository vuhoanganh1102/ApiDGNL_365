const express = require('express');
const router = express.Router();
var formData = require('express-form-data');
const Dx_xinThoiViec = require('../../../controllers/vanthu/DeXuat/de_xuat_xin_thoi_viec');

router.post('/De_Xuat_Xin_thoi_Viec', formData.parse(), Dx_xinThoiViec.de_xuat_xin_thoi_Viec);
module.exports = router;

