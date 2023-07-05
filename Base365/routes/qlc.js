var express = require('express');
var router = express.Router();


var Admin = require('./qlc/admin/QLC_Admin')
var companyRouterQLC = require('./qlc/QLC_Company')
var EmployeeRouterQLC = require('./qlc/QLC_Employee')
var individualRouterQLC = require('./qlc/QLC_Individual')
var deparmentRouter = require('./qlc/QLC_Deparment')
var teamRouter = require('./qlc/QLC_Team');
var groupRouter = require('./qlc/QLC_Group');
var shiftRouter = require('./qlc/Shift');
var calendarRouter = require('./qlc/Calendar');
var childCompanyRouter = require('./qlc/QLC_ChildCompany')
var managerUser = require('./qlc/QLC_ManagerUser')
var DelAppData = require('./qlc/QLC_DelAppData')
var TrackingQR = require('./qlc/TrackingQR')
var TrackingWifi = require('./qlc/TrackingWifi')
var CheckVip = require('./qlc/QLC_CheckVip')
var Feedback = require('./qlc/QLC_Feedback')
var ReportError = require('./qlc/QLC_ReportError')
var employeeRoutes = require('./qlc/Employee.routes');
var individualRoutes = require('./qlc/Individual.routes');
var HisOfTrackingRouter = require("./qlc/HisTracking")
var CalendarWorkEmployee = require("./qlc/CalendarWorkEmployee")
var SetIpRouter = require("./qlc/QLC_SettingIP")
var homePage = require("./qlc/HomePageChamCong")



router.use('/Admin', Admin);
router.use('/Company', companyRouterQLC);
router.use('/employee', EmployeeRouterQLC);
router.use('/individual', individualRouterQLC);
router.use('/department', deparmentRouter);
router.use('/team', teamRouter);
router.use('/group', groupRouter);
router.use('/shift', shiftRouter);
router.use('/calendar', calendarRouter);
router.use('/childCompany', childCompanyRouter);
router.use('/managerUser', managerUser);
router.use('/delAppData', DelAppData);
router.use('/trackingQR', TrackingQR);
router.use('/trackingWifi', TrackingWifi);
router.use('/checkVip', CheckVip);
router.use('/feedback', Feedback);
router.use('/reportError', ReportError);
router.use('/employeeRoutes', employeeRoutes);
router.use('/individualRoutes', individualRoutes);
router.use('/hisOfTracking', HisOfTrackingRouter);
router.use('/calendarWorkEmployee', CalendarWorkEmployee);
router.use('/setIp', SetIpRouter);
router.use('/homePage', homePage);

module.exports = router;