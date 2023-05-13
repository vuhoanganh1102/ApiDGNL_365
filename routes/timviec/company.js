var express = require('express');
var router = express.Router();
var company = require('../../controllers/timviec/company');
var formData = require('express-form-data')
const functions = require('../../services/functions')
    // api đăng ký
router.post('/register', functions.uploadVideoAndIMGRegister.fields([
    { name: 'avatarUser' },
    { name: 'videoType' }
]), company.register);

// api đăng ký khi thiếu dữ liệu
router.post('/registerfall', formData.parse(), company.registerFall);

// api gửi mã OTP qua gmail để xác minh tài khoản
router.post('/sendOTP', formData.parse(), company.sendOTP);

// api xác nhận OTP để xác minh tìa khoản
router.post('/verify', formData.parse(), company.verify);

// api api gửi mã OTP qua appChat (quên mật khẩu) 
router.post('/forgotPasswordCheckMail', formData.parse(), company.forgotPasswordCheckMail);

// api check mã OTP đẻ (quên mật khẩu)
router.post('/forgotPasswordCheckOTP', formData.parse(), functions.checkToken, company.forgotPasswordCheckOTP);

// api đổi mật khẩu (quên mật khẩu)
router.post('/updatePassword', formData.parse(), functions.checkToken, company.updatePassword);

// api cập nhập thông tin nhà tuyển dụng
router.post('/updateInfor', formData.parse(), functions.checkToken, company.updateInfoCompany);

// api cập nhập thông tin liên hệ nhà tuyển dụng
router.post('/updateContactInfor', formData.parse(), functions.checkToken, company.updateContactInfo);

// api cập nhập video hoặc link video nhà tuyển dụng
router.post('/updateVideoOrLink', functions.checkToken, functions.uploadVideo.single('videoType'), company.updateVideoOrLink);

// api gửi mã OTP qua appChat (dổi mật khẩu)
router.get('/changePasswordSendOTP', functions.checkToken, company.changePasswordSendOTP);

// api check mã OTP (đổi mật khẩu)
router.post('/changePasswordCheckOTP', formData.parse(), functions.checkToken, company.changePasswordCheckOTP);

// api đổi mật khẩu (đổi mật khẩu )
router.post('/changePassword', formData.parse(), functions.checkToken, company.changePassword);

// api cập nhập ảnh đại diện
router.put('/uploadAvatar', functions.checkToken, functions.uploadImg.single('avatarUser'), company.updateImg);

//api lấy dữ liệu nhà tuyển dụng
router.get('/getDataCompany', functions.checkToken, company.getDataCompany)

// api lấy danh sach UV
router.post('/listUVApplyJob', formData.parse(), functions.checkToken, company.listUVApplyJob)

// api lấy danh sach UV do chuyên viên gửi
router.post('/listUVApplyJobStaff', formData.parse(), functions.checkToken, company.listUVApplyJobStaff)

//api thống kê tin đăng
router.get('/postStatistics', functions.checkToken, company.postStatistics)

//api lấy danh sách lưu UV
router.post('/listSaveUV', formData.parse(), functions.checkToken, company.listSaveUV)

//api quản lý lọc điểm
router.get('/manageFilterPoint', formData.parse(), functions.checkToken, company.manageFilterPoint)

//api xem điểm uv 
router.post('/seenUVWithPoint', formData.parse(), functions.checkToken, company.seenUVWithPoint)

//api đánh giá ctv 
router.post('/submitFeedbackCtv', formData.parse(), functions.checkToken, company.submitFeedbackCtv)

//api đánh giá web 
router.post('/submitFeedbackWeb', formData.parse(), functions.checkToken, company.submitFeedbackWeb)

//api lấy ra dữ liệu kho ảnh
router.post('/displayImages', formData.parse(), functions.checkToken, company.displayImages)

//api upload ảnh trong kho ảnh
router.post('/uploadImg', functions.checkToken, functions.uploadImgKhoAnh.array('comImages'), company.uploadImg)

//api upload video trong kho ảnh
router.post('/uploadVideo', functions.checkToken, functions.uploadVideoKhoAnh.array('comVideos'), company.uploadVideo)

//api xóa ảnh trong kho ảnh
router.post('/deleteImg', functions.checkToken, formData.parse(), company.deleteImg)

//api xóa video trong kho ảnh
router.post('/deleteVideo', functions.checkToken, formData.parse(), company.deleteVideo)

// //api xóa video trong kho ảnh
// router.post('/getData', functions.checkToken, formData.parse(), company.getDataCompany)

module.exports = router;