var express = require('express');
var router = express.Router();

var recruitment = require('./hr/recruitmentRoute');
var trainingRoute = require('./hr/trainingRoute');
var settingRoute = require('./hr/settingRoute');
var administrationRoute = require('./hr/administrationRoute');
var welfare = require('./hr/welfareRoute');
var organizationalStructure = require('./hr/organizationalStructure');
var personalChangeRoute = require('./hr/personalChangeRoute');
var managerEmployeeRoute = require('./hr/managerEmployeeRoute');

router.use('/recruitment', recruitment);
router.use('/training', trainingRoute);
router.use('/setting', settingRoute);
router.use('/administration', administrationRoute);
router.use('/welfare', welfare);
router.use('/organizationalStructure', organizationalStructure);
router.use('/personalChange', personalChangeRoute);
router.use('/managerEmployee', managerEmployeeRoute);

module.exports = router;