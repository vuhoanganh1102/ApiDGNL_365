var express = require('express');
var router = express.Router();
var toolUser = require('../controllers/tools/user');
var formData = require('express-form-data');
const functions = require('../services/functions');

// API quét data người dùng từ base chat
router.post('/addUser', formData.parse(), toolUser.addUserChat365);

module.exports = router;