const router = require('express').Router()
const employee = require('../../controllers/qlc/Employee')

//đăng kí tài khoản nhân viên 
router.post('/register',employee.register)
//Đăng nhập tài khoản công ty
router.post('/login',employee.login)
// api gửi mã OTP qua gmail để xác minh tài khoản
router.post('/sendOTP', employee.sendOTP);
// api xác nhận OTP để xác minh tìa khoản
router.post('/verify', employee.verify);
// hàm đổi mật khẩu 
router.post('/updatePassword', employee.updatePassword);
// hàm cập nhập thông tin công ty
router.post('/updateInfoEmployee', employee.updateInfoEmployee);
// hàm cập nhập avatar
router.post('/updateImg', employee.updateImg);
// api api gửi mã OTP qua mail (quên mật khẩu) 
router.post('/forgotPasswordCheckMail',employee.forgotPasswordCheckMail);
// api check mã OTP  (quên mật khẩu)P
router.post('/forgotPasswordCheckOTP',employee.forgotPasswordCheckOTP);
// api đổi mật khẩu (quên mật khẩu)
router.post('/updatePassword',employee.updatePassword);





module.exports = router