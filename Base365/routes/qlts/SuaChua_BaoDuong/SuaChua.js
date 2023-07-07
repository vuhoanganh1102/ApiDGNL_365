const router = require('express').Router();
const formData = require('express-form-data');
const controllers = require('../../../controllers/qlts/SuaChua_BaoDuong/SuaChua');
const functions = require('../../../services/functions');


router.post('/addSuaChua', functions.checkToken, formData.parse(), controllers.addSuaChua);
router.post('/HoanThanhSuaChua', functions.checkToken, formData.parse(), controllers.HoanThanhSuaChua);
router.post('/EditSuaChua', functions.checkToken, formData.parse(), controllers.SuaChuaBB);
router.post('/Seach', functions.checkToken, formData.parse(), controllers.Seach);
router.post('/getListData', functions.checkToken, formData.parse(), controllers.listDataSuaChua);
module.exports = router;