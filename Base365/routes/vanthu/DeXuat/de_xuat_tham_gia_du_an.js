const express = require('express');
const router = express.Router();
var formData = require('express-form-data');
const ThamGiaDuAn = require('../../../controllers/vanthu/DeXuat/de_xuat_tham_gia_du_an');

router.post('/De_Xuat_Tham_Gia_Du_An', formData.parse(), ThamGiaDuAn.de_xuat_tham_gia_du_an);
console.log("routes");
module.exports = router;
