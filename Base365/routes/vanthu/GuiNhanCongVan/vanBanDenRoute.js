const router = require('express').Router();
const vanBanDenController = require("../../../controllers/vanthu/GuiNhanCongVan/vanBanDenController");
var formData = require('express-form-data');
const functions = require('../../../services/functions');
const vanThuService = require('../../../services/vanThu');

router.post('/getListVanBanCanDuyet', vanThuService.checkToken, formData.parse(), vanBanDenController.getListVanBanCanDuyet);

module.exports = router