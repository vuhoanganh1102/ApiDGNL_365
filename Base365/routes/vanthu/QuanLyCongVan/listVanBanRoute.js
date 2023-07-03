const router = require('express').Router();
const functions = require('../../../services/functions')
const listVanBanController = require('../../../controllers/vanthu/QuanLyCongVan/listVanBanController')
var formData = require('express-form-data');

// lấy danh sách văn bản đến
router.post('/getListVanBanDen',functions.checkToken,formData.parse(),listVanBanController.getListVanBanDen)

// thêm văn bản đến
router.post('/createListIncomingText',functions.checkToken,formData.parse(),listVanBanController.createListIncomingText)

module.exports = router;