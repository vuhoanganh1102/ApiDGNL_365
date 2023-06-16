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

//lay ra danh sach va tim kiem
router.post('/listCandi', formData.parse(), hrService.HR_CheckTokenCompany, recruitmentController.getListCandidate);

//lay ra tong so ung vien theo ngay, tuan, thang
router.get('/totalCandi', formData.parse(), hrService.HR_CheckTokenCompany, recruitmentController.getTotalCandidateFollowDayMonth);

//them moi
router.post('/candi', formData.parse(), hrService.HR_CheckTokenCompany, recruitmentController.checkDataCandidate,recruitmentController.createCandidate);

//sua
router.put('/candi', formData.parse(), hrService.HR_CheckTokenCompany, recruitmentController.checkDataCandidate, recruitmentController.updateCandidate);

//xoa tam thoi
router.put('/softDeleteCandi', formData.parse(), hrService.HR_CheckTokenCompany, recruitmentController.softDeleteCandidate);

//-----------------------------api giai doan tuyen dung
router.get('/process',hrService.HR_CheckTokenCompany, recruitmentController.getListProcessInterview);

//them moi
router.post('/process', formData.parse(), hrService.HR_CheckTokenCompany, recruitmentController.checkDataProcess,recruitmentController.createProcessInterview);

//sua
router.put('/process', formData.parse(), hrService.HR_CheckTokenCompany, recruitmentController.checkDataProcess, recruitmentController.updateProcessInterview);

//xoa 
router.delete('/process', formData.parse(), hrService.HR_CheckTokenCompany, recruitmentController.deleteProcessInterview);

//-----------------------------chuyen trang thai cua ung vien

//ky hop dong
router.post('/contactJob', formData.parse(), hrService.HR_CheckTokenCompany, recruitmentController.checkDataJob,recruitmentController.createContactJob);

//huy cong viec
router.post('/cancelJob', formData.parse(), hrService.HR_CheckTokenCompany, recruitmentController.checkDataJob,recruitmentController.createCancelJob);

//truot ung vien
router.post('/failJob', formData.parse(), hrService.HR_CheckTokenCompany, recruitmentController.checkDataJob,recruitmentController.createFailJob);

//them lich phong van gui mail
router.post('/scheduleInter', formData.parse(), hrService.HR_CheckTokenCompany, recruitmentController.checkDataJob,recruitmentController.createScheduleInterview);

module.exports = router;