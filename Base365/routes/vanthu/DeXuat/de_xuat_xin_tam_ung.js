const express = require('express');
const router = express.Router();
const data = require('express-form-data');
const De_xua_tam_ung = require('../../../controllers/vanthu/DeXuat/de_xuat_xin_tam_ung');
router.post('/De_Xuat_Xin_Tam_Ung', data.parse(), De_xua_tam_ung.de_xuat_xin_tam_ung);
module.exports = router;