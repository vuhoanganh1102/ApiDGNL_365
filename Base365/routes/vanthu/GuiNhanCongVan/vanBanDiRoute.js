const router = require('express').Router();
const vanBanDiController = require("../../../controllers/vanthu/GuiNhanCongVan/vanBanDiController");
var formData = require('express-form-data');
const functions = require('../../../services/functions');
const vanThuService = require('../../../services/vanThu');

router.post('/createVanBanIn',vanThuService.checkToken,formData.parse(), vanBanDiController.getDataAndCheck, vanBanDiController.createVanBanIn);
router.post('/createVanBanOut',vanThuService.checkToken,formData.parse(), vanBanDiController.getDataAndCheck, vanBanDiController.createVanBanOut);

module.exports = router