const router = require("express").Router();
const formData = require("express-form-data");
const functions = require('../../../../services/functions');
const fnc = require('../../../../services/QLTS/qltsService');
const controllers = require('../../../../controllers/qlts/SuaChua_BaoDuong/BaoDuong/TheoDoiCongSuat');

//don vi do cong suat 
router.post('/add_donvi_csuat', functions.checkToken, fnc.checkRole('SC_BD'), formData.parse(), controllers.add_dvi_csuat);
module.exports = router;