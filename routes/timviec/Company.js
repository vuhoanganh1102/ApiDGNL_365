var express = require('express');
var router = express.Router();
var company = require('../../controllers/timviec/company');
var formData=require('express-form-data')
const functions=require('../../services/functions')
router.post('/register',functions.uploadImg.single('avatarUser'),company.register);
router.post('/registerfall',formData.parse(),company.registerFall)
module.exports = router;