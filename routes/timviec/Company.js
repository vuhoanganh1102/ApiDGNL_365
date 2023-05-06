var express = require('express');
var router = express.Router();
var company = require('../../controllers/timviec/company');
var formData=require('express-form-data')
const functions=require('../../services/functions')
router.post('/register',functions.uploadImg.single('avatarUser'),company.register);
router.post('/registerfall',formData.parse(),company.registerFall)
router.post('/sendOTP',formData.parse(),company.sendOTP)
router.post('/verify',formData.parse(),company.verify)
router.post('/forgotPasswordCheckMail',formData.parse(),company.forgotPasswordCheckMail)
router.post('/forgotPasswordCheckOTP',formData.parse(),company.forgotPasswordCheckOTP)
router.post('/updatePassword',formData.parse(),company.updatePassword)


module.exports = router;
module.exports = router;