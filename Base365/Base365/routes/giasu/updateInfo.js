var express = require('express');
var router = express.Router();
const controller =  require('../../controllers/giasu/updateInfo');
const formData = require("express-form-data")
const functions = require('../../services/functions');

//cập nhật thông tin phụ huynh
router.post('/updateInfoParent',functions.checkToken, formData.parse(), controller.updateInfoParent);
//lấy thông tin chi tiết phụ huynh
router.post('/detailParent',functions.checkToken, formData.parse(), controller.detailParent);


module.exports = router;