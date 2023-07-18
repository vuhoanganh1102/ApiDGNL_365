const router = require('express').Router();
const vanBanDenController = require("../../../controllers/vanthu/GuiNhanCongVan/vanBanDenController");
var formData = require('express-form-data');
const functions = require('../../../services/functions');
const vanThuService = require('../../../services/vanthu');

router.post('/getListVanBanMoi', vanThuService.checkToken, formData.parse(), vanBanDenController.getListVanBanMoi);
router.post('/getListVanBanDaXuLy', vanThuService.checkToken, formData.parse(), vanBanDenController.getListVanBanDaXuLy);
router.post('/getListVanBanCanDuyet', vanThuService.checkToken, formData.parse(), vanBanDenController.getListVanBanCanDuyet);
router.post('/getListVanBanThuHoi', vanThuService.checkToken, formData.parse(), vanBanDenController.getListVanBanThuHoi);
router.post('/getListVanBanCapNhat', vanThuService.checkToken, formData.parse(), vanBanDenController.getListVanBanCapNhat);

router.post('/sendFeedback', vanThuService.checkToken, formData.parse(), vanBanDenController.sendFeedback);
router.post('/sendLeader', vanThuService.checkToken, formData.parse(), vanBanDenController.sendLeader);

module.exports = router