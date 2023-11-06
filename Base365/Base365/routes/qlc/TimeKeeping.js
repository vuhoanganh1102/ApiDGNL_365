const router = require('express').Router();
const Controller = require('../../controllers/qlc/TimeSheet');
// const functions= require ("../../services/functions")
const formData = require("express-form-data")
const functions = require("../../services/functions")

// lịch sử chấm công được ghi lại 
router.post('/create/web', functions.checkToken, formData.parse(), Controller.SaveForWeb);
router.post('/com/success', formData.parse(), Controller.getListUserTrackingSuccess);
router.post('/com/false', formData.parse(), Controller.getlistUserNoneHistoryOfTracking);
router.post('/employee/home', functions.checkToken, formData.parse(), Controller.EmployeeHome);
module.exports = router