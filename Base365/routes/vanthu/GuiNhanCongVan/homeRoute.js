const router = require('express').Router();
const homeController = require("../../../controllers/vanthu/GuiNhanCongVan/homeController");
var formData = require('express-form-data');
const functions = require('../../../services/functions');
const vanThuService = require('../../../services/vanthu');

router.post('/getTotalVanBan', vanThuService.checkToken,formData.parse(),homeController.getTotalVanBan);

module.exports = router