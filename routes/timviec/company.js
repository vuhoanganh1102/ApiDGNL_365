var express = require('express');
var router = express.Router();
var company = require('../../controllers/timviec/company');
var formData=require('express-form-data')
const functions=require('../../services/functions')
// api đăng ký
router.post('/register',functions.uploadImg.single('avatarUser'),company.register);
// api đăng ký khi thiếu dữ liệu
router.post('/registerfall',formData.parse(),company.registerFall);
// api gửi mã OTP qua gmail để xác minh tài khoản
router.post('/sendOTP',formData.parse(),company.sendOTP);
// api xác nhận OTP để xác minh tìa khoản
router.post('/verify',formData.parse(),company.verify);
// api api gửi mã OTP qua appChat (quên mật khẩu) 
router.post('/forgotPasswordCheckMail',formData.parse(),company.forgotPasswordCheckMail);
// api check mã OTP đẻ (quên mật khẩu)
router.post('/forgotPasswordCheckOTP',formData.parse(),functions.checkToken,company.forgotPasswordCheckOTP);
// api đổi mật khẩu (quên mật khẩu)
router.post('/updatePassword',formData.parse(),functions.checkToken,company.updatePassword);
// api cập nhập thông tin nhà tuyển dụng
router.post('/updateInfor',formData.parse(),functions.checkToken,company.updateInfoCompany);
// api cập nhập thông tin liên hệ nhà tuyển dụng
router.post('/updateContactInfor',formData.parse(),functions.checkToken,company.updateContactInfo);
// api cập nhập video hoặc link video nhà tuyển dụng
router.post('/updateVideoOrLink',functions.uploadVideo.single('videoType'),functions.checkToken,company.updateVideoOrLink);
// api gửi mã OTP qua appChat để (dổi mật khẩu)
router.get('/changePasswordSendOTP',functions.checkToken,company.changePasswordSendOTP);
// api check mã OTP (đổi mật khẩu)
router.post('/changePasswordCheckOTP',formData.parse(),functions.checkToken,company.changePasswordCheckOTP);
// api đổi mật khẩu (đổi mật khẩu )
router.post('/changePassword',formData.parse(),functions.checkToken,company.changePassword);
// api cập nhập ảnh đại diện
router.post('/uploadAvatar',functions.uploadImg.single('avatarUser'),functions.checkToken,company.uploadIMG);

module.exports = router;