const router = require('express').Router()
const company = require('../../controllers/qlc/Company.js')
const functions= require ("../../services/functions")
var formData = require('express-form-data')
//Đăng kí tài khoản công ty 
router.post('/register', formData.parse(),  company.register)
//Đăng nhập tài khoản công ty
router.post('/login', formData.parse(),  company.login)
// api gửi mã OTP qua gmail để xác minh tài khoản
router.post('/sendOTP',  formData.parse(),  company.sendOTP);
// api xác nhận OTP để xác minh tìa khoản
router.post('/verify',  formData.parse(),  company.verify);
// hàm đổi mật khẩu 
router.post('/updateNewPassword',functions.checkToken, formData.parse(),   company.updatePassword);
// hàm cập nhập thông tin công ty
router.post('/updateInfoCompany', formData.parse(), functions.checkToken,  company.updateInfoCompany);
// api api gửi mã OTP qua mail (quên mật khẩu) 
router.post('/forgotPasswordCheckMail', formData.parse(),  company.forgotPasswordCheckMail);
// api check mã OTP  (quên mật khẩu)
router.post('/forgotPasswordCheckOTP', formData.parse(), company.forgotPasswordCheckOTP);
// api đổi mật khẩu (quên mật khẩu)
router.post('/updatePassword',functions.checkToken, formData.parse(),  company.updatePassword);




module.exports  = router