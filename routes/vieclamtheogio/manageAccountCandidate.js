var express = require('express');
var router = express.Router();
var manageAccountCandidate = require('../../controllers/vieclamtheogio/manageAccountCandidate');
var formData = require('express-form-data');
const functions = require('../../services/functions');

//danh sach nganh nghe
router.post('/danhSachNganhNghe', formData.parse(), manageAccountCandidate.danhSachNganhNghe);

//lay ra thong tin cong viec mong muon va ky nang ban than
router.post('/getCongViecMongMuon', formData.parse(), functions.checkToken, manageAccountCandidate.getCongViecMongMuon);
router.post('/updateCongViecMongMuon', formData.parse(), functions.checkToken, manageAccountCandidate.updateCongViecMongMuon);
router.post('/updateKyNangBanThan', formData.parse(), functions.checkToken, manageAccountCandidate.updateKyNangBanThan);
//kinh nghiem lam viec
router.post('/getKinhNghiemLamViec', formData.parse(), functions.checkToken, manageAccountCandidate.getKinhNghiemLamViec);
router.post('/createKinhNghiemLamViec', formData.parse(), functions.checkToken, manageAccountCandidate.createKinhNghiemLamViec);
router.post('/updateKinhNghiemLamViec', formData.parse(), functions.checkToken, manageAccountCandidate.updateKinhNghiemLamViec);
router.post('/deleteKinhNghiemLamViec', formData.parse(), functions.checkToken, manageAccountCandidate.deleteKinhNghiemLamViec);
//buoi co the di lam
router.post('/getBuoiCoTheDiLam', formData.parse(), functions.checkToken, manageAccountCandidate.getBuoiCoTheDiLam);
router.post('/updateBuoiCoTheDiLam', formData.parse(), functions.checkToken, manageAccountCandidate.updateBuoiCoTheDiLam);

//viec lam da ung tuyen
router.post('/getViecLamDaUngTuyen', formData.parse(), functions.checkToken, manageAccountCandidate.getViecLamDaUngTuyen);
router.post('/deleteViecLamDaUngTuyen', formData.parse(), functions.checkToken, manageAccountCandidate.deleteViecLamDaUngTuyen);

//viec lam da luu
router.post('/getViecLamDaLuu', formData.parse(), functions.checkToken, manageAccountCandidate.getViecLamDaLuu);
router.post('/deleteViecLamDaLuu', formData.parse(), functions.checkToken, manageAccountCandidate.deleteViecLamDaLuu);

//xu ly cac chuc nang lien quan
router.post('/nhanViec', formData.parse(), functions.checkToken, manageAccountCandidate.nhanViec);
router.post('/luuViecLam', formData.parse(), functions.checkToken, manageAccountCandidate.luuViecLam);

module.exports = router;