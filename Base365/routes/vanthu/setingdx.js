

var express = require('express');
var router = express.Router();
var settingDx = require('../../controllers/tools/vanthu');
var formData = require('express-form-data');

const functions = require('../../services/functions');

router.get('/settingDeXuat', formData.parse(), settingDx.toolSettingDx);
module.exports = router;