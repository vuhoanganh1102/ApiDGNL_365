var express = require('express');
var router = express.Router();
var vanbanthaythe = require('../../controllers/tools/vanthu');
var formData = require('express-form-data');

const functions = require('../../services/functions');

router.get('/vanBanThaythe', formData.parse(), vanbanthaythe.tool_VanBanThayThe);
module.exports = router;