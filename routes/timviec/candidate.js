const express = require('express');
const candidate = require('../../controllers/timviec/candidate');
const formData = require('express-form-data');
const router = express.Router();
const { uploadFileUv } = require('../../services/functions.js');
const functions = require('../../services/functions')

router.get('/', candidate.index);
router.post('/RegisterB1', formData.parse(), candidate.RegisterB1);
router.post('/RegisterB2VideoUpload', functions.checkToken, uploadFileUv.single('videoUpload'), candidate.RegisterB2VideoUpload);
router.post('/RegisterB2CvUpload', functions.checkToken, uploadFileUv.fields([
    { name: "cvUpload" },
    { name: "videoUpload" }
]), candidate.RegisterB2CvUpload);
router.post('/RegisterB2CvSite', functions.checkToken, uploadFileUv.single('imageUpload'), candidate.RegisterB2CvSite);
router.post('/loginUv', formData.parse(), candidate.loginUv);
router.post('/completeProfileQlc', formData.parse(), functions.checkToken, candidate.completeProfileQlc);
router.post('/cvXinViec', formData.parse(), functions.checkToken, candidate.cvXinViec);
router.post('/donXinViec', formData.parse(), functions.checkToken, candidate.donXinViec);
router.post('/thuXinViec', formData.parse(), functions.checkToken, candidate.thuXinViec);
router.post('/hosoXinViec', formData.parse(), functions.checkToken, candidate.hosoXinViec);
router.post('/listJobCandidateApply', formData.parse(), functions.checkToken, candidate.listJobCandidateApply);
router.post('/listJobCandidateSave', formData.parse(), functions.checkToken, candidate.listJobCandidateSave);
router.post('/updateContactInfo', functions.checkToken, uploadFileUv.single('imageUpload'), candidate.updateContactInfo);
router.post('/updateDesiredJob', formData.parse(), functions.checkToken, candidate.updateDesiredJob);
router.post('/updateCareerGoals', formData.parse(), functions.checkToken, candidate.updateCareerGoals);
router.post('/updateSkills', formData.parse(), functions.checkToken, candidate.updateSkills);
router.post('/updateReferencePersonInfo', formData.parse(), functions.checkToken, candidate.updateReferencePersonInfo);
router.post('/RefreshProfile', formData.parse(), functions.checkToken, candidate.RefreshProfile);
router.post('/updateIntroVideo', functions.checkToken, uploadFileUv.single('videoUpload'), candidate.updateIntroVideo);
router.post('/updateAvatarUser', functions.checkToken, uploadFileUv.single('logo'), candidate.updateAvatarUser);
router.post('/upLoadHoSo', functions.checkToken, uploadFileUv.single('cv'), candidate.upLoadHoSo);
router.post('/addDegree', formData.parse(), functions.checkToken, candidate.addDegree);
router.post('/updateDegree', formData.parse(), functions.checkToken, candidate.updateDegree);
router.post('/deleteDegree', formData.parse(), functions.checkToken, candidate.deleteDegree);
router.post('/addNgoaiNgu', formData.parse(), functions.checkToken, candidate.addNgoaiNgu);
router.post('/updateNgoaiNgu', formData.parse(), functions.checkToken, candidate.updateNgoaiNgu);
router.post('/deleteNgoaiNgu', formData.parse(), functions.checkToken, candidate.deleteNgoaiNgu);
router.post('/addExp', formData.parse(), functions.checkToken, candidate.addExp);
router.post('/updateExp', formData.parse(), functions.checkToken, candidate.updateExp);
router.post('/deleteExp', formData.parse(), functions.checkToken, candidate.deleteExp);
router.post('/randomUv', formData.parse(), functions.checkToken, candidate.randomUv);
router.post('/selectiveUv', formData.parse(), functions.checkToken, candidate.selectiveUv);
router.post('/candidateAI', formData.parse(), candidate.candidateAI);
// quên mật khẩu
router.post('/sendOTP', formData.parse(), candidate.sendOTP);
router.post('/confirmOTP', formData.parse(), functions.checkToken, candidate.confirmOTP); // kiểm tra token( có + còn thời gian) -> xác nhận otp
router.post('/changePassword', formData.parse(), functions.checkToken, candidate.changePassword); // kiểm tra token( có + còn thời gian) -> đổi mật khẩu

//đổi mật khẩu
router.post('/sendOTPChangePass', formData.parse(), functions.checkToken, candidate.sendOTPChangePass); //phần gửi otp khác với quên mật khẩu, còn phần xác nhận otp với phần đổi mật khẩu thì giống nhau
module.exports = router;