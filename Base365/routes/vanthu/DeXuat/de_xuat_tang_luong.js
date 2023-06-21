const express = require('express');
const router = express.Router();
const data = require('express-form-data');
const De_xuat_tang_luong = require('../../../controllers/vanthu/DeXuat/de_xuat_tang_luong');
router.post('/De_Xuat_Xin_Tang_Luong', data.parse(), De_xuat_tang_luong.de_xuat_tang_luong);
module.exports = router;