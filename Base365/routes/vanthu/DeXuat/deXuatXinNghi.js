const express = require('express');
const router = express.Router();
var formData = require('express-form-data');
const Dx_xinNghi = require('../../../controllers/vanthu/DeXuat/de_xuat_xin_nghi');

router.post('/De_Xuat_Xin_Nghi', formData.parse(), Dx_xinNghi.de_xuat_xin_nghi);
module.exports = router;