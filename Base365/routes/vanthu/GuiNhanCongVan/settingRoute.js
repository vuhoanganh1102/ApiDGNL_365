const router = require('express').Router();
const settingController = require("../../../controllers/vanthu/GuiNhanCongVan/settingController");
var formData = require('express-form-data');
const vanThuService = require('../../../services/vanThu');

router.post('/thietLapQuyen', vanThuService.checkToken, settingController.thietLapQuyen);
router.post('/getListSoVanBan', formData.parse(), vanThuService.checkToken, settingController.getListSoVanBan);
router.post('/createSoVanBan', formData.parse(), vanThuService.checkToken, settingController.createSoVanBan);
router.post('/updateSoVanBan', formData.parse(), vanThuService.checkToken, settingController.updateSoVanBan);
router.post('/deleteSoVanBan', formData.parse(), vanThuService.checkToken, settingController.deleteSoVanBan);

module.exports = router