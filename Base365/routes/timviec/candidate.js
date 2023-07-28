const express = require('express');
const candidate = require('../../controllers/timviec/candidate');
const formData = require('express-form-data');
const router = express.Router();
const { uploadFileUv } = require('../../services/functions.js');
const functions = require('../../services/functions')

// Check mail tồn tại
router.post('/checkAccountExist', formData.parse(), candidate.checkAccountExist);

//api đăng kí b1
router.post('/RegisterB1', formData.parse(), candidate.RegisterB1);

// api đăng kí b2 bằng video
router.post('/RegisterB2VideoUpload', functions.checkToken, uploadFileUv.single('videoUpload'), candidate.RegisterB2VideoUpload);

// api đăng kí b2 bằng cv
router.post('/RegisterB2CvUpload', functions.checkToken, uploadFileUv.fields([
    { name: "cvUpload" },
    { name: "videoUpload" }
]), candidate.RegisterB2CvUpload);

//api đăng kí bước 2 bằng cách tạo cv trên site
router.post('/RegisterB2CvSite', functions.checkToken, candidate.RegisterB2CvSite);

router.post('/authentic', functions.checkToken, candidate.authentic);

//api đăng nhập ứng viên
router.post('/loginUv', formData.parse(), candidate.loginUv);

//api hiển thị trang qlc trong hoàn thiện hồ sơ
router.post('/completeProfileQlc', formData.parse(), functions.checkToken, candidate.completeProfileQlc);

//api hiển thị danh sách cv xin việc của ứng viên
router.post('/cvXinViec', formData.parse(), functions.checkToken, candidate.cvXinViec);

// api chọn cv đại diện
router.post('/chooseCv', formData.parse(), functions.checkToken, candidate.chooseCv);

// api xóa cv
router.post('/delfile', formData.parse(), functions.checkToken, candidate.delfile);

//api hiển thị danh sách đơn xin việc cảu ứng viên
router.post('/donXinViec', formData.parse(), functions.checkToken, candidate.donXinViec);

//api hiển thị danh sách thư xin việc của ứng viên
router.post('/thuXinViec', formData.parse(), functions.checkToken, candidate.thuXinViec);

//api hiển thị danh sách hồ sơ xin việc của ứng viên
router.post('/hosoXinViec', formData.parse(), functions.checkToken, candidate.hosoXinViec);

// api xóa cv, đơn, thư đã lưu
router.post('/deleteFile', formData.parse(), functions.checkToken, candidate.deleteFile);

//api hiển thị danh sách việc làm ứng viên đã ứng tuyển
router.post('/listJobCandidateApply', formData.parse(), functions.checkToken, candidate.listJobCandidateApply);

// Xóa tin tuyển dụng đã ứng tuyển
router.post('/deleteJobCandidateApply', formData.parse(), functions.checkToken, candidate.deleteJobCandidateApply);

//api hiển thị danh sách việc làm ứng viên đã lưu
router.post('/listJobCandidateSave', formData.parse(), functions.checkToken, candidate.listJobCandidateSave);

//api cập nhật thông tin liên hệ
router.post('/updateContactInfo', functions.checkToken, uploadFileUv.single('imageUpload'), candidate.updateContactInfo);

//api cập nhật công việc mong muốn
router.post('/updateDesiredJob', formData.parse(), functions.checkToken, candidate.updateDesiredJob);

//cập nhật mục tiêu nghề nghiệp
router.post('/updateCareerGoals', formData.parse(), functions.checkToken, candidate.updateCareerGoals);

//api cập nhật kỹ năng bản thân
router.post('/updateSkills', formData.parse(), functions.checkToken, candidate.updateSkills);

//api cập nhật thông tin người tham chiếu
router.post('/updateReferencePersonInfo', formData.parse(), functions.checkToken, candidate.updateReferencePersonInfo);

//api làm mới hồ sơ
router.post('/RefreshProfile', formData.parse(), functions.checkToken, candidate.RefreshProfile);

//api cập nhật video giới thiệu
router.post('/updateIntroVideo', functions.checkToken, uploadFileUv.single('videoUpload'), candidate.updateIntroVideo);

//api cập nhật ảnh đại diện
router.post('/updateAvatarUser', functions.checkToken, functions.uploadAvatar.single('AvatarUser'), candidate.updateAvatarUser);

//api cập nhật hồ sơ
router.post('/upLoadHoSo', functions.checkToken, formData.parse(), candidate.upLoadHoSo);

//api lấy hồ sơ đã tải lên
router.post('/listProfileUploaded', functions.checkToken, formData.parse(), candidate.listProfileUploaded);

//api thêm sửa xóa bằng cấp chứng chỉ
router.post('/addDegree', formData.parse(), functions.checkToken, candidate.addDegree);
router.post('/updateDegree', formData.parse(), functions.checkToken, candidate.updateDegree);
router.post('/deleteDegree', formData.parse(), functions.checkToken, candidate.deleteDegree);

//api thêm sửa xóa ngoại ngữ tin học
router.post('/addNgoaiNgu', formData.parse(), functions.checkToken, candidate.addNgoaiNgu);
router.post('/updateNgoaiNgu', formData.parse(), functions.checkToken, candidate.updateNgoaiNgu);
router.post('/deleteNgoaiNgu', formData.parse(), functions.checkToken, candidate.deleteNgoaiNgu);

//api thêm sửa xóa kinh nghiệm làm việc
router.post('/addExp', formData.parse(), functions.checkToken, candidate.addExp);
router.post('/updateExp', formData.parse(), functions.checkToken, candidate.updateExp);
router.post('/deleteExp', formData.parse(), functions.checkToken, candidate.deleteExp);

//api danh sách ứng viên ngẫu nhiên, theo ngành nghề, vị trí
router.post('/selectiveUv', formData.parse(), functions.checkToken, candidate.selectiveUv);

//api danh sách ứng viên tương tự được AI gợi ý
router.post('/candidateAI', formData.parse(), candidate.candidateAI);

// quên mật khẩu
router.post('/sendOTP', formData.parse(), candidate.sendOTP);
router.post('/forgotPassConfirmOTP', formData.parse(), candidate.forgotPassConfirmOTP);
router.post('/forgotPassChangePassword', formData.parse(), candidate.forgotPassChangePassword);

router.post('/confirmOTP', formData.parse(), functions.checkToken, candidate.confirmOTP); // kiểm tra token( có + còn thời gian) -> xác nhận otp

router.post('/changePassword', formData.parse(), functions.checkToken, candidate.changePassword); // kiểm tra token( có + còn thời gian) -> đổi mật khẩu

//đổi mật khẩu
router.post('/sendOTPChangePass', formData.parse(), functions.checkToken, candidate.sendOTPChangePass); //phần gửi otp khác với quên mật khẩu, còn phần xác nhận otp với phần đổi mật khẩu thì giống nhau

// Danh sách ứng viên
router.post('/list', formData.parse(), functions.checkTokenV2, candidate.list);

//Thông tin chi tiết ứng viên
router.post('/infoCandidate', formData.parse(), functions.checkTokenV2, candidate.infoCandidate);

// Tăng lượt view cho ứng viên
router.post('/upView', formData.parse(), candidate.upView);

//ứng viên ứng tuyển 
router.post('/candidateApply', formData.parse(), functions.checkToken, candidate.candidateApply);

//ứng viên ứng tuyển nhiều tin
router.post('/candidateApplyList', formData.parse(), functions.checkToken, candidate.candidateApplyList);

//ứng viên gửi thư ứng tuyển 
router.post('/candidateSendLetterApply', formData.parse(), functions.checkToken, candidate.candidateSendLetterApply);

//ứng viên lưu tin 
router.post('/candidateSavePost', formData.parse(), functions.checkToken, candidate.candidateSavePost);

// Đánh giá NTD qua tin tuyển dụng
router.post('/evaluateCompany', formData.parse(), functions.checkToken, candidate.evaluateCompany);
router.post('/list_tag_involved', formData.parse(), candidate.list_tag_involved);
router.post('/list_keyword_involved', formData.parse(), candidate.list_keyword_involved);

// Cập nhật cho phép NTD tìm kiếm ứng viên hay không?
router.post('/setting_display', functions.checkToken, candidate.setting_display);
router.post('/fastUploadProfile', functions.checkTokenV2, candidate.fastUploadProfile);
module.exports = router;