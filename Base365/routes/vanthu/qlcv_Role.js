var express = require('express');
var router = express.Router();
var qlcvRole = require('../../controllers/tools/vanthu');
var formData = require('express-form-data');

const functions = require('../../services/functions');

router.get('/qlcvRole', formData.parse(), qlcvRole.tool_qlcv_role);
module.exports = router;