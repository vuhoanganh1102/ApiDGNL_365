const express = require('express');
const router = express.Router();
var formData = require('express-form-data');
const Dx_xinBoNhiem = require('../../../controllers/vanthu/DeXuat/de_xuat_bo_nhiem');

router.post('/De_Xuat_Xin_Bo_Nhiem', formData.parse(), Dx_xinBoNhiem.de_xuat_xin_bo_nhiem);
module.exports = router;

