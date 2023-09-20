const router = require('express').Router();
const formData = require('express-form-data');
const controllers = require('../../../controllers/qlts/dieu_chuyen_ban_giao/DieuChuyenDonViQuanLi');
const functions = require('../../../services/functions');
const fnc = require('../../../services/QLTS/qltsService')



router.post('/create', functions.checkToken,fnc.checkRole("DC_BG",2) , formData.parse(), controllers.create);

router.post('/edit', functions.checkToken,fnc.checkRole("DC_BG",2) , formData.parse(), controllers.edit);

router.post('/list', functions.checkToken, formData.parse(), controllers.list);

module.exports = router;