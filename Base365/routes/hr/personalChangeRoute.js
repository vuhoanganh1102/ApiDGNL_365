var express = require('express');
var router = express.Router();
var personalChangeController = require('../../controllers/hr/personalChangeController');
var formData = require('express-form-data');
const functions = require('../../services/functions');
const hrService = require('../../services/hr/hrService');

//------------------------------api module quan ly nhan vien

//----------bo nhiem/quy hoach
router.post('/getListAppoint', formData.parse(), hrService.checkRoleUser, personalChangeController.getListAppoint);
router.post('/createAppoint', formData.parse(), hrService.checkRoleUser, personalChangeController.getAndCheckData, personalChangeController.createAppoint);
router.post('/updateAppoint', formData.parse(), hrService.checkRoleUser, personalChangeController.getAndCheckData, personalChangeController.updateAppoint);
router.post('/deleteAppoint', formData.parse(), hrService.checkRoleUser, personalChangeController.deleteAppoint);

//----------luan chuyen cong tac
router.post('/getListTranferJob', formData.parse(), hrService.checkRoleUser, personalChangeController.getListTranferJob);
router.post('/updateTranferJob', formData.parse(), hrService.checkRoleUser, personalChangeController.getAndCheckData, personalChangeController.updateTranferJob);
router.post('/deleteTranferJob', formData.parse(), hrService.checkRoleUser, personalChangeController.deleteTranferJob);


module.exports = router;