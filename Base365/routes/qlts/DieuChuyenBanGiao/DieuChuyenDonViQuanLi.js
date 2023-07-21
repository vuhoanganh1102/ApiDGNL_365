const router = require('express').Router();
const formData = require('express-form-data');
const controllers = require('../../../controllers/qlts/dieu_chuyen_ban_giao/DieuChuyenDonViQuanLi');
const functions = require('../../../services/functions');



router.post('/create', functions.checkToken, formData.parse(), controllers.create);

router.post('/edit', functions.checkToken, formData.parse(), controllers.edit);

router.post('/list', functions.checkToken, formData.parse(), controllers.list);

module.exports = router;