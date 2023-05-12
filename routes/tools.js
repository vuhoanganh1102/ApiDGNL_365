var express = require('express');
var router = express.Router();
var toolUser = require('../controllers/tools/user');
var formData = require('express-form-data');
const functions = require('../services/functions');

// API quét data người dùng từ base chat
router.post('/addUserChat365', formData.parse(), toolUser.addUserChat365);
router.post('/addUserCompanyTimviec365', toolUser.addUserCompanyTimviec365);
router.post('/addUserCandidateTimviec365', toolUser.addUserCandidateTimviec365);
router.post('/deleteUser', toolUser.deleteUser);

module.exports = router;