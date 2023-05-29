const router = require('express').Router()
const individual = require('../../controllers/qlc/individual')


//đăng kí tài khoản cá nhân 
router.post('/register',individual.register)
//Đăng nhập tài khoản công ty
router.post('/login',individual.login)
// api gửi mã OTP qua gmail để xác minh tài khoản
router.post('/sendOTP', individual.sendOTP);
// api xác nhận OTP để xác minh tìa khoản
router.post('/verify', individual.verify);
// hàm đổi mật khẩu 
router.post('/updatePassword', individual.updatePassword);
// hàm cập nhập thông tin công ty
router.post('/updateInfoindividual', individual.updateInfoindividual);
// hàm cập nhập avatar
router.post('/updateImg', individual.updateImg);
// api api gửi mã OTP qua mail (quên mật khẩu) 
router.post('/forgotPasswordCheckMail',individual.forgotPasswordCheckMail);
// api check mã OTP  (quên mật khẩu)P
router.post('/forgotPasswordCheckOTP',individual.forgotPasswordCheckOTP);
// api đổi mật khẩu (quên mật khẩu)
router.post('/updatePassword',individual.updatePassword);



module.exports = router