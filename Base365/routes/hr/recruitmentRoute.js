var express = require('express');
var router = express.Router();
var recruitmentController = require('../../controllers/hr/recruitmentController');
var formData = require('express-form-data');
const functions = require('../../services/functions');
const hrService = require('../../services/hr/hrService');

//api lay ra danh sach recruitmentController theo cac truong
router.post('/getRecruit', formData.parse(), hrService.HR_CheckTokenCompany, recruitmentController.getListRecruitment);

//
router.post('/', formData.parse(), hrService.HR_CheckTokenCompany, recruitmentController.createRecruitment);

//
router.put('/', formData.parse(), hrService.HR_CheckTokenCompany, recruitmentController.updateRecruitment);

//xoa quy trinh tuyen dung vao muc da xoa gan day
router.put('/softDelete', formData.parse(), hrService.HR_CheckTokenCompany, recruitmentController.softDeleteRecruitment);
//xoa vinh vien
router.delete('/', formData.parse(), hrService.HR_CheckTokenCompany, recruitmentController.deleteRecruitment);

//-------------------------------api tin tuyen dung

//lay ra ds tin va tim kiem tin
router.post('/listNews', formData.parse(), hrService.HR_CheckTokenCompany, recruitmentController.getListRecruitmentNews);

//them moi tin tuyen dung
router.post('/news', formData.parse(), hrService.HR_CheckTokenCompany, recruitmentController.checkDataRecruitmentNews, recruitmentController.createRecruitmentNews);

//sua
router.put('/news', formData.parse(), hrService.HR_CheckTokenCompany, recruitmentController.checkDataRecruitmentNews, recruitmentController.updateRecruitmentNews);

//xoa tam thoi
router.put('/softDeleteNews', formData.parse(), hrService.HR_CheckTokenCompany, recruitmentController.softDeleteRecuitmentNews);

//-------------------------------api ung vien
router.post('/candi', formData.parse(), hrService.HR_CheckTokenCompany, recruitmentController.getListRecruitmentNews);

module.exports = router;