var express = require('express');
var router = express.Router();
var qlCongVan = require('../../controllers/tools/vanthu');
var formData = require('express-form-data');

const functions = require('../../services/functions');

router.get('/quanLiCongVan', formData.parse(), qlCongVan.tool_qlcv_congVan);
module.exports = router;