var express = require('express');
var router = express.Router();
var formData = require('express-form-data');
var walfare  = require('../../controllers/hr/walfareController');
// thêm khen thưởng
router.post('/addAchievement',formData.parse(),walfare.addAchievement)

module.exports = router;