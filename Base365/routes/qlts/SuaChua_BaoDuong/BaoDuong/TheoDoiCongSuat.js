const router = require("express").Router();
const formData = require("express-form-data");
const functions = require('../../../../services/functions');
const fnc = require('../../../../services/QLTS/qltsService');
const controllers = require('../../../../controllers/qlts/SuaChua_BaoDuong/BaoDuong/TheoDoiCongSuat');

//don vi do cong suat 
router.post('/add_donvi_csuat', functions.checkToken, fnc.checkRole('SC_BD'), formData.parse(), controllers.add_dvi_csuat);
router.post('/detail_donvi_csuat', functions.checkToken, fnc.checkRole('SC_BD'), formData.parse(), controllers.detail_dvi_csuat);
router.post('/edit_donvi_csuat', functions.checkToken, fnc.checkRole('SC_BD'), formData.parse(), controllers.edit_dvi_csuat);

// theo doi cong suat
router.post('/add_theodoi_csuat', functions.checkToken, fnc.checkRole('SC_BD'), formData.parse(), controllers.add_do_csuat);
router.post('/detail_theodoi_csuat', functions.checkToken, fnc.checkRole('SC_BD'), formData.parse(), controllers.detail_csuat_tsan);
router.post('/update_theodoi_csuat', functions.checkToken, fnc.checkRole('SC_BD'), formData.parse(), controllers.update_theodoi_cs);
module.exports = router;