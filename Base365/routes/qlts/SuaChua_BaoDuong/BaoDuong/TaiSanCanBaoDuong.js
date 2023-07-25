const router = require('express').Router();
const formData = require('express-form-data');
const controllers = require('../../../../controllers/qlts/SuaChua_BaoDuong/BaoDuong/TaiSanCanBaoDuong');
const functions = require('../../../../services/functions');
const fnc = require('../../../../services/QLTS/qltsService');


//ts can bao duong 
router.post('/add_ts_can_bao_duong', functions.checkToken, fnc.checkRole('SC_BD'), formData.parse(), controllers.add_Ts_can_bao_duong);
router.post('/tu_choi_ts_can_bao_duong', functions.checkToken, fnc.checkRole('SC_BD'), formData.parse(), controllers.TuChoiBaoDuong);
router.post('/delete1', functions.checkToken, fnc.checkRole('SC_BD'), formData.parse(), controllers.delete1);
router.post('/deleteAll', functions.checkToken, fnc.checkRole('SC_BD'), formData.parse(), controllers.deleteAll);
router.post('/deltails_ts_can_baoduong', functions.checkToken, fnc.checkRole('SC_BD'), formData.parse(), controllers.detailTSCBD);
module.exports = router;