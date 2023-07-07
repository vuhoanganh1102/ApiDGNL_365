const router = require('express').Router();
const functions = require('../../../services/functions')
const vanThu = require('../../../services/vanThu')
const contractController = require('../../../controllers/vanthu/QuanLyCongVan/contractController')
var formData = require('express-form-data');
// get data trang chủ site quản lý công văn
router.post('/getListContract',vanThu.checkToken,formData.parse(),contractController.getListContract)

// thêm hợp đồng đến
router.post('/createSendContract',vanThu.checkToken,formData.parse(),contractController.createSendContract)

// sửa hợp đồng đến
router.put('/updateSendContract',vanThu.checkToken,formData.parse(),contractController.updateSendContract)

// thêm hợp đồng đi
router.post('/createContract',vanThu.checkToken,formData.parse(),contractController.createContract)

// sửa hợp đồng đi
router.put('/updateContract',vanThu.checkToken,formData.parse(),contractController.updateContract)
module.exports = router;