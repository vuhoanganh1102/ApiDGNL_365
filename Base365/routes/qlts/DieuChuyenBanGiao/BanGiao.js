const router = require('express').Router();
const formData = require('express-form-data');
const controllers = require('../../../controllers/qlts/dieu_chuyen_ban_giao/BanGiao');
const functions = require('../../../services/functions');
const fnc = require('../../../services/QLTS/qltsService')



router.post('/list', functions.checkToken,fnc.checkRole("DC_BG",1), formData.parse(), controllers.list);

router.post('/listDetailAllocation', functions.checkToken,fnc.checkRole("DC_BG",1), formData.parse(), controllers.listDetailAllocation);

router.post('/listDetailRecall', functions.checkToken,fnc.checkRole("DC_BG",1), formData.parse(), controllers.listDetailRecall);

module.exports = router;