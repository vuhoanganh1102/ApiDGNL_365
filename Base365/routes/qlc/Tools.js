var express = require('express');
var router = express.Router();
const qlc = require('../../controllers/tools/quanlichung')



//API Quản lí chung 
router.post('/toolSettingIP', qlc.toolsettingIP);
router.post('/toolDeparment', qlc.toolDeparment);
router.post('/toolGroup', qlc.toolGroup);
router.post('/toolCompany', qlc.toolCompany);
router.post('/toolHisTracking', qlc.toolHisTracking);
router.post('/toolCheckDevice', qlc.toolCheckDevice);
router.post('/toolShifts', qlc.toolShifts);
router.post('/toolFeedback', qlc.toolFeedback);
router.post('/toolReportError', qlc.toolReportError);
router.post('/toolCalendarWorkEmployee', qlc.toolCalendarWorkEmployee);
router.post('/toolCalendar', qlc.toolCalendar);

module.exports = router;
