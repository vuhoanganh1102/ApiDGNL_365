// routes/qlc.js
const express = require('express');
const router = express.Router();

const deparmentRouter = require('./qlc/deparment');
const teamRouter = require('./qlc/team');
const groupRouter = require('./qlc/group');
const shiftRouter = require('./qlc/shift');
const calendarRouter = require('./qlc/calendar');
const childCompanyRouter = require('./qlc/childCompany');
const managerUser = require('./qlc/managerUser');
const employeeRoutes = require('./qlc/employee.routes');
const individualRoutes = require('./qlc/individual.routes');
const manageUserRouter = require('./qlc/manageUser');

router.use('/deparment', deparmentRouter);
router.use('/team', teamRouter);
router.use('/group', groupRouter);
router.use('/shift', shiftRouter);
router.use('/calendar', calendarRouter);
router.use('/childCompany', childCompanyRouter);
router.use('/managerUser', managerUser);
router.use('/employee', employeeRoutes);
router.use('/individual', individualRoutes);
router.use('/manageUser', manageUserRouter);

module.exports = router;