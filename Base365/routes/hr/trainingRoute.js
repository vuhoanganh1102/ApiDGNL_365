var express = require('express');
var router = express.Router();
var trainingController = require('../../controllers/hr/trainingController');
var formData = require('express-form-data');
const functions = require('../../services/functions');
const hrService = require('../../services/hr/hrService');


//------------------------------api module vi tri cong viec
//api lay ra danh sach vi tri cong viec
router.post('/listJob', formData.parse(), hrService.HR_CheckTokenCompany, trainingController.getListJobDescription);

//them moi vi tri cong viec
router.post('/job', formData.parse(), hrService.HR_CheckTokenCompany, trainingController.createJobDescription);

//xoa vi tri cong viec => muc du lieu xoa gan day
router.put('/jobSoftDelete', formData.parse(), hrService.HR_CheckTokenCompany, trainingController.softDeleteJobDescription);

module.exports = router;