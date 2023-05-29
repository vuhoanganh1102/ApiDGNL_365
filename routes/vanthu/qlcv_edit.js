var express = require('express');
var router = express.Router();
var qlcv_edit = require('../../controllers/tools/vanthu');
var formData = require('express-form-data');
var tooltblFeedback = require('../../controllers/tools/vanthu');
const functions = require('../../services/functions');

router.get('/qlcv_edit', formData.parse(), qlcv_edit.tool_qlcv_edit);
module.exports = router;