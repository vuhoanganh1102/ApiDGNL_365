const router = require('express').Router();
const formData = require('express-form-data');
const controllers = require('../../../controllers/qlts/dieu_chuyen_ban_giao/DieuChuyenViTri');
const functions = require('../../../services/functions');



router.post('/addDieuChuyenViTri', functions.checkToken, formData.parse(), controllers.addDieuchuyenTaiSan);

router.post('/editDieuChuyenViTri', functions.checkToken, formData.parse(), controllers.editDCTS);
router.post('/deleteDieuChuyenViTri', functions.checkToken, formData.parse(), controllers.deleteBBDieuChuyen);
router.post('/detailsDCVT', functions.checkToken, formData.parse(), controllers.detailsDCVTTS);
router.post('/TuChoiDCVT', functions.checkToken, formData.parse(), controllers.TuchoiDCVT);
router.post('/TiepNhanDCVT', functions.checkToken, formData.parse(), controllers.TiepNhanDCVT);
module.exports = router;