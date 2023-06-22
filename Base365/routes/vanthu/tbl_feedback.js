var express = require('express');
var router = express.Router();
var tblFeedback = require('../../controllers/tools/vanthu');
var formData = require('express-form-data');

const functions = require('../../services/functions');

router.get('/Feedback', formData.parse(), tblFeedback.tooltblFeedback);
module.exports = router;