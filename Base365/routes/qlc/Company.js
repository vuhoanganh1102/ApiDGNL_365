const router = require('express').Router()
const company = require('../../controllers/qlc/Company.js')

//Đăng kí tài khoản công ty 
router.post('/register', company.register)
//Đăng nhập tài khoản công ty
router.post('/login',company.login)
// api gửi mã OTP qua gmail để xác minh tài khoản
router.post('/sendOTP', company.sendOTP);
// api xác nhận OTP để xác minh tìa khoản
router.post('/verify', company.verify);
// hàm đổi mật khẩu 
router.post('/updateNewPassword', company.updatePassword);
// hàm cập nhập thông tin công ty
router.post('/updateInfoCompany', company.updateInfoCompany);
// hàm cập nhập avatar
router.post('/updateImg', company.updateImg);
// api api gửi mã OTP qua mail (quên mật khẩu) 
router.post('/forgotPasswordCheckMail',company.forgotPasswordCheckMail);
// api check mã OTP  (quên mật khẩu)
router.post('/forgotPasswordCheckOTP',company.forgotPasswordCheckOTP);
// api đổi mật khẩu (quên mật khẩu)
router.post('/updatePassword',company.updatePassword);














module.exports  = router