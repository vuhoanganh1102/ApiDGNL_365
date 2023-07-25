const router = require('express').Router();
const formData = require('express-form-data');
const controllers = require('../../../controllers/qlts/dieu_chuyen_ban_giao/DieuChuyenViTri');
const functions = require('../../../services/functions');
const fnc = require('../../../services/QLTS/qltsService');



router.post('/addDieuChuyenViTri', functions.checkToken, fnc.checkRole('DC_BG'), formData.parse(), controllers.addDieuchuyenTaiSan);

router.post('/editDieuChuyenViTri', functions.checkToken, fnc.checkRole('DC_BG'), formData.parse(), controllers.editDCTS);
router.post('/deleteDieuChuyenViTri', functions.checkToken, fnc.checkRole('DC_BG'), formData.parse(), controllers.deleteBBDieuChuyen);
router.post('/detailsDCVT', functions.checkToken, fnc.checkRole('DC_BG'), formData.parse(), controllers.detailsDCVTTS);
router.post('/TuChoiDCVT', functions.checkToken, fnc.checkRole('DC_BG'), formData.parse(), controllers.TuchoiDCVT);
router.post('/TiepNhanDCVT', functions.checkToken, fnc.checkRole('DC_BG'), formData.parse(), controllers.TiepNhanDCVT);
router.post('/list_dieuChuyen_vitri', functions.checkToken, fnc.checkRole('DC_BG'), formData.parse(), controllers.listBB);
module.exports = router;