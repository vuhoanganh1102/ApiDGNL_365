const express = require('express');
const router = express.Router();
var formData = require('express-form-data');
const Dx_xinDoiCa = require('../../../controllers/vanthu/DeXuat/de_xuat_doi_ca');

router.post('/De_Xuat_Xin_Doi_Ca', formData.parse(), Dx_xinDoiCa.de_xuat_doi_ca);
module.exports = router;

