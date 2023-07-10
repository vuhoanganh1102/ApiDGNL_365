const router = require('express').Router();
const functions = require('../../../services/functions')
const controller = require('../../../controllers/vanthu/QuanLyCongVan/dataDidDeleteController')
var formData = require('express-form-data');

// lấy dữ liệu 
router.post('/getDataDidDelete',functions.checkToken,formData.parse(),controller.getDataDidDelete)

// lấy chi tiết data đã xoá
router.post('/getDetailDataDelete',functions.checkToken,formData.parse(),controller.getDetailDataDelete)

module.exports = router;