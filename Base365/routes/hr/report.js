var express = require('express');
var router = express.Router();
var report = require('../../controllers/hr/report');
var formData = require('express-form-data');
const functions = require('../../services/functions');
const hrService = require('../../services/hr/hrService');


router.post('/report', formData.parse(), hrService.HR_CheckTokenCompany, report.report);



module.exports = router;