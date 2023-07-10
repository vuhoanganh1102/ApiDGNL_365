const router = require('express').Router();
const functions = require('../../../services/functions')
const historyUpdateController = require('../../../controllers/vanthu/QuanLyCongVan/historyUpdateController')
var formData = require('express-form-data');


// lấy danh sách văn bản đến
router.post('/getDataHistory',functions.checkToken,formData.parse(),historyUpdateController.getDataHistory)

// lấy chi tiết văn bản đến
router.post('/getDetailHistoryUpdate',functions.checkToken,formData.parse(),historyUpdateController.getDetailHistoryUpdate)
module.exports = router;