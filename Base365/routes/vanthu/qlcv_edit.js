var express = require('express');
var router = express.Router();
var qlcv_edit = require('../../controllers/tools/vanthu');
var formData = require('express-form-data');


router.get('/qlcv_edit', formData.parse(), qlcv_edit.tool_qlcv_edit);

module.exports = router;