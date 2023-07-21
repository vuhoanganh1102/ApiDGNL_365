const router = require('express').Router();
const formData = require('express-form-data');
const controllers = require('../../../controllers/qlts/SuaChua_BaoDuong/BaoDuong');
const functions = require('../../../services/functions');
const fnc = require('../../../services/QLTS/qltsService');

router.post('/add_ts_can_bao_duong', functions.checkToken, fnc.checkRole('SC_BD'), formData.parse(), controllers.add_Ts_can_bao_duong);
router.post('/tu_choi_ts_can_bao_duong', functions.checkToken, fnc.checkRole('SC_BD'), formData.parse(), controllers.TuChoiBaoDuong);
router.post('/delete1', functions.checkToken, fnc.checkRole('SC_BD'), formData.parse(), controllers.delete1);
router.post('/deleteAll', functions.checkToken, fnc.checkRole('SC_BD'), formData.parse(), controllers.deleteAll);
module.exports = router;
