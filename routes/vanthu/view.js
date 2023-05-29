var express = require('express');
var router = express.Router();
var view = require('../../controllers/tools/vanthu');
var formData = require('express-form-data');
const functions = require('../../services/functions');

router.get('/View', view.tool_View);
module.exports = router;