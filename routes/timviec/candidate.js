const express = require('express');

const candidate = require('../../controllers/timviec/candidate');
const formData = require('express-form-data');
const router = express.Router();
const {uploadFile} = require('../../services/functions.js');

router.get('/', candidate.index);
router.post('/RegisterB1',formData.parse(), candidate.RegisterB1);
router.post('/RegisterB2CvUpload',uploadFile.single('videoUpload'), candidate.RegisterB2VideoUpload);

router.post('/login',formData.parse(),candidate.login);
router.post('/AddUserChat365',formData.parse(),candidate.AddUserChat365);


// đổi mật khẩu
router.post('/sendOTP',formData.parse(),candidate.sendOTP);
router.post('/confirmOTP',formData.parse(),candidate.confirmOTP);
router.post('/changePassword',formData.parse(),candidate.changePassword);

module.exports = router;