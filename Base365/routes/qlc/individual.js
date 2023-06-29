const router = require('express').Router()
const individual = require('../../controllers/qlc/individual')
const functions= require ("../../services/functions")
var formData = require('express-form-data')

//đăng kí tài khoản cá nhân 
router.post('/register', formData.parse(), individual.register)
//Đăng nhập tài khoản công ty
router.post('/login', formData.parse(), individual.login)
// api gửi mã OTP qua gmail để xác minh tài khoản
// router.post('/sendOTP', formData.parse(),  individual.sendOTP);
// api xác nhận OTP để xác minh tìa khoản
router.post('/verify', formData.parse(),  individual.verify);
// hàm đổi mật khẩu 
router.post('/updatePassword',functions.checkToken, formData.parse(),  individual.updatePassword);
// hàm cập nhập thông tin công ty
router.post('/updateInfoindividual',functions.checkToken, formData.parse(),  individual.updateInfoindividual);
// hàm cập nhập avatar
// router.post('/updateImg',functions.checkToken, formData.parse(),  individual.updateImg);
// api api gửi mã OTP qua mail (quên mật khẩu) 
router.post('/forgotPasswordCheckMail', formData.parse(), individual.forgotPassword);
// api check mã OTP  (quên mật khẩu)P
// router.post('/forgotPasswordCheckOTP', formData.parse(), individual.forgotPasswordCheckOTP);
// // api đổi mật khẩu (quên mật khẩu)
// router.post('/updatePassword', formData.parse(), functions.checkToken,individual.updatePassword);



module.exports = router