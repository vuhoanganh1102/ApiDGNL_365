var express = require('express');
var router = express.Router();
var company = require('../../controllers/timviec/company');
var formData = require('express-form-data')
const uploadAvatarUser = require('../../services/functions')


router.get('/', company.index);

// router.post('/register',uploadAvatarUser.upload.single('avatarUser'),company.register);
router.post('/login',formData.parse(),company.login)

module.exports = router;