const router = require('express').Router();
const functions = require('../../../services/functions')
const controller = require('../../../controllers/vanthu/QuanLyCongVan/settingController')
var formData = require('express-form-data');

// lấy danh sách quyền người dùng
 router.post('/getdecentralization',functions.checkToken,formData.parse(),controller.getdecentralization)

// phân quyền người dùng 
router.post('/decentralization',functions.checkToken,formData.parse(),controller.decentralization)

module.exports = router;