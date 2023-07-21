const router = require('express').Router();
const formData = require('express-form-data');
const controllers = require('../../../controllers/qlts/SuaChua_BaoDuong/BaoDuong');
const functions = require('../../../services/functions');


router.post('/add_ts_can_bao_duong', functions.checkToken, formData.parse(), controllers.add_Ts_can_bao_duong);
router.post('/tu_choi_ts_can_bao_duong', functions.checkToken, formData.parse(), controllers.TuChoiBaoDuong);
module.exports = router;
