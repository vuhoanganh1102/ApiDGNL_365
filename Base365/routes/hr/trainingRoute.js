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

//---------------------------api quy trinh dao tao
router.post('/listProcessTrain', formData.parse(), hrService.checkRoleUser, trainingController.getListProcessTraining);
router.post('/detailProcess', formData.parse(), hrService.checkRoleUser, trainingController.getDetailProcessTraining);
router.post('/process', formData.parse(), hrService.checkRoleUser, trainingController.createProcessTraining);
router.put('/softDeleteProcess', formData.parse(), hrService.checkRoleUser, trainingController.softDeleteProcessTraining);

//---------------------------api giai doan trong quy trinh
router.post('/stage', formData.parse(), hrService.checkRoleUser, trainingController.createStageProcessTraining);
router.put('/stage', formData.parse(), hrService.checkRoleUser, trainingController.updateStageProcessTraining);
router.put('/softDeleteStage', formData.parse(), hrService.checkRoleUser, trainingController.softDeleteStageProcessTraining);

module.exports = router;