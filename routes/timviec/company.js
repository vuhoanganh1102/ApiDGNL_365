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
router.post('/forgotPasswordCheckOTP',formData.parse(),functions.checkToken,company.forgotPasswordCheckOTP)
router.post('/updatePassword',formData.parse(),functions.checkToken,company.updatePassword)
router.post('/updatePassword',formData.parse(),functions.checkToken,company.updatePassword)
router.post('/updateInfor',functions.uploadImg.single('avatarUser'),functions.checkToken,company.updateInfoCompany)
router.post('/updateContactInfor',formData.parse(),functions.checkToken,company.updateContactInfo)


module.exports = router;