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
router.post('/AddUserChat365', formData.parse(), candidate.AddUserChat365);
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
router.post('/updateAvatarUser', functions.checkToken, uploadFileUv.single('imageUpload'), candidate.updateAvatarUser);
router.post('/upLoadHoSo', functions.checkToken, uploadFileUv.single('hosoUpload'), candidate.upLoadHoSo);

module.exports = router;