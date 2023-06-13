const express = require('express');
var router = express.Router();
const formData = require('express-form-data');
const functions = require('../../services/functions')
const userRN = require('../../controllers/raonhanh365/user');
// lấy mã otp
router.post('/changePasswordSendOTP',formData.parse(),functions.checkToken,userRN.changePasswordSendOTP)

// cập nhật thông tin user
router.put('/updateInfoUserRaoNhanh',formData.parse(),functions.checkToken,userRN.updateInfoUserRaoNhanh)

// check otp
router.post('/changePasswordCheckOTP',formData.parse(),functions.checkToken,userRN.changePasswordCheckOTP)

// đổi mật khẩu
router.post('/changePassword',formData.parse(),functions.checkToken,userRN.changePassword)

// thông báo
router.post('/announceResult',formData.parse(),functions.checkToken,userRN.announceResult)

// danh sách khách hàng online
router.get('/listUserOnline/:link',userRN.listUserOnline);

//xac thuc thanh toan dam bao
router.post('/createVerifyPayment', formData.parse(), functions.checkToken, userRN.createVerifyPayment);

module.exports = router;