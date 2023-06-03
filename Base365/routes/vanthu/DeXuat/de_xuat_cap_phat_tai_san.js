const express = require('express');
const router = express.Router();
var formData = require('express-form-data');
const capPhatTaiSan = require('../../../controllers/vanthu/DeXuat/de_xuat_cap_phat_tai_san');

router.post('/De_Xuat_Cap_Phat_Tai_San', formData.parse(), capPhatTaiSan.de_xuat_xin_cap_phat_tai_san);
module.exports = router;

