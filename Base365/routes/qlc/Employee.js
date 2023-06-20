const router = require('express').Router()
const employee = require('../../controllers/qlc/Employee')
const functions= require ("../../services/functions")
var formData = require('express-form-data')
//đăng kí tài khoản nhân viên 
router.post('/register', formData.parse(),  employee.register)
//Đăng nhập tài khoản công ty
router.post('/login', formData.parse(),  employee.login)
// api gửi mã OTP qua gmail để xác minh tài khoản
router.post('/sendOTP', formData.parse(),  employee.sendOTP);
// api xác nhận OTP để xác minh tìa khoản
router.post('/verify', formData.parse(),  employee.verify);
// hàm đổi mật khẩu 
router.post('/updatePassword',functions.checkToken, formData.parse(),   employee.updatePassword);
// hàm cập nhập thông tin công ty
router.post('/updateInfoEmployee',functions.checkToken,  formData.parse(),  employee.updateInfoEmployee);
// hàm cập nhập avatar
router.post('/updateImg',functions.checkToken,  formData.parse(),  employee.updateImg);
// api api gửi mã OTP qua mail (quên mật khẩu) 
router.post('/forgotPasswordCheckMail', formData.parse(),  employee.forgotPasswordCheckMail);
// api check mã OTP  (quên mật khẩu)P
router.post('/forgotPasswordCheckOTP', formData.parse(),  employee.forgotPasswordCheckOTP);
// api đổi mật khẩu (quên mật khẩu)
router.post('/updatePassword',functions.checkToken, formData.parse(),  employee.updatePassword);





module.exports = router