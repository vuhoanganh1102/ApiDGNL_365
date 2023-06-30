const router = require('express').Router();
const vanBanDiController = require("../../../controllers/vanthu/GuiNhanCongVan/vanBanDiController");
var formData = require('express-form-data');
const functions = require('../../../services/functions');

router.post('/createVanBan',functions.checkToken,formData.parse(), vanBanDiController.createVanBanDi);

module.exports = router