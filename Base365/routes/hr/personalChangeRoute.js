var express = require('express');
var router = express.Router();
var personalChangeController = require('../../controllers/hr/personalChangeController');
var formData = require('express-form-data');
const functions = require('../../services/functions');
const hrService = require('../../services/hr/hrService');

//------------------------------api module quan ly nhan vien

//api lay ra danh sach nhan vien va tim kiem
// router.post('/listAppoint', formData.parse(), hrService.checkRoleUser, personalChangeController.getListAppoint);
router.post('/createAppoint', formData.parse(), hrService.checkRoleUser, personalChangeController.getAndCheckData, personalChangeController.createAppoint);
router.post('/updateAppoint', formData.parse(), hrService.checkRoleUser, personalChangeController.getAndCheckData, personalChangeController.updateAppoint);
router.post('/deleteAppoint', formData.parse(), hrService.checkRoleUser, personalChangeController.deleteAppoint);

module.exports = router;