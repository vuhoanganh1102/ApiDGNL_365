const router = require('express').Router();
const vanBanDiController = require("../../../controllers/vanthu/GuiNhanCongVan/vanBanDiController");
var formData = require('express-form-data');
const functions = require('../../../services/functions');
const vanThuService = require('../../../services/vanThu');

router.post('/createVanBanIn',vanThuService.checkToken,formData.parse(), vanBanDiController.getDataAndCheck, vanBanDiController.createVanBanIn);
router.post('/createVanBanOut',vanThuService.checkToken,formData.parse(), vanBanDiController.getDataAndCheck, vanBanDiController.createVanBanOut);
router.post('/getListVanBanDiDaGui',vanThuService.checkToken,formData.parse(), vanBanDiController.getListVanBanDiDaGui);

router.post('/createChuyenTiep',vanThuService.checkToken,formData.parse(), vanBanDiController.createChuyenTiep);
router.post('/deleteVanBan',vanThuService.checkToken,formData.parse(), vanBanDiController.deleteVanBan);
router.post('/checkLuuQLCV',vanThuService.checkToken,formData.parse(), vanBanDiController.checkLuuQLCV);
router.post('/luuVBCTY',vanThuService.checkToken,formData.parse(), vanBanDiController.luuVBCTY);
router.post('/setTrangThaiVanBan',vanThuService.checkToken,formData.parse(), vanBanDiController.setTrangThaiVanBan);


module.exports = router