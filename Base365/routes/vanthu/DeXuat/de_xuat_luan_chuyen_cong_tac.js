const express = require('express');
const router = express.Router();
var formData = require('express-form-data');
const Dx_LuanChuyenCongTac = require('../../../controllers/vanthu/DeXuat/de_xuat_luan_chuyen_cong_tac');

router.post('/De_Xuat_Luan_Chuyen_Cong_Tac', formData.parse(), Dx_LuanChuyenCongTac.de_xuat_luan_chuyen_cong_tac);
module.exports = router;

