var express = require('express');
var router = express.Router();
var formData = require('express-form-data');
var walfare  = require('../../controllers/hr/walfareController');
const HR =  require('../../services/hr/hrService');

// thêm khen thưởng
router.post('/addAchievement',HR.HR_CheckTokenCompany,formData.parse(),walfare.addAchievement)

module.exports = router;