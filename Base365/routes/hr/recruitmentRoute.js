var express = require('express');
var router = express.Router();
var recruitmentController = require('../../controllers/hr/recruitmentController');
var formData = require('express-form-data');
const functions = require('../../services/functions');
const hrService = require('../../services/hr/hrService');

//api lay ra danh sach recruitmentController theo cac truong
router.post('/getRecruitment', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 1), recruitmentController.getListRecruitment);

//them moi quy trinh
router.post('/createRecruitment', hrService.checkRoleUser, hrService.checkRight(1, 2), recruitmentController.createRecruitment);

//sua quy trinh
router.post('/updateRecruitment', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 3), recruitmentController.updateRecruitment);

//xoa quy trinh tuyen dung vao muc da xoa gan day
router.post('/softDelete', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 4), recruitmentController.softDeleteRecruitment);


//---giai doan trong quy trinh
router.post('/getStage', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 1), recruitmentController.getStageRecruitment);
//them giai doan trong quy trinh
router.post('/stage', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 2), recruitmentController.createStageRecruitment);
//sua giai doan trong quy trinh
router.put('/stage', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 3), recruitmentController.updateStageRecruitment);
//xoa gia doan
router.put('/softDeleteStage', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 4), recruitmentController.softDeleteStageRecruitment);

//-------------------------------api tin tuyen dung

//lay ra ds tin va tim kiem tin
router.post('/listNews', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 1), recruitmentController.getListRecruitmentNews);

//them moi tin tuyen dung
router.post('/news', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 2), recruitmentController.checkDataRecruitmentNews, recruitmentController.createRecruitmentNews);

//sua
router.put('/news', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 3), recruitmentController.checkDataRecruitmentNews, recruitmentController.updateRecruitmentNews);

//xoa tam thoi
router.put('/softDeleteNews', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 4), recruitmentController.softDeleteRecuitmentNews);

//-------------------------------api ung vien

//lay ra danh sach va tim kiem
router.post('/listCandi', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 1), recruitmentController.getListCandidate);

//lay ra tong so ung vien theo ngay, tuan, thang
router.get('/totalCandi', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 1), recruitmentController.getTotalCandidateFollowDayMonth);

//them moi
router.post('/candi', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 2), recruitmentController.checkDataCandidate,recruitmentController.createCandidate);

//sua
router.put('/candi', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 3), recruitmentController.checkDataCandidate, recruitmentController.updateCandidate);

//xoa tam thoi
router.put('/softDeleteCandi', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 4), recruitmentController.softDeleteCandidate);

//-----------------------------api giai doan tuyen dung
router.post('/getListProcess',hrService.checkRoleUser, hrService.checkRight(1, 1), recruitmentController.getListProcessInterview);

//them moi
router.post('/createProcess', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 2), recruitmentController.checkDataProcess,recruitmentController.createProcessInterview);

//sua
router.post('/updateProcess', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 3), recruitmentController.checkDataProcess, recruitmentController.updateProcessInterview);

//xoa 
router.post('/deleteProcess', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 4), recruitmentController.deleteProcessInterview);

//-----------------------------chuyen trang thai cua ung vien

//ky hop dong
router.post('/contactJob', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 3), recruitmentController.checkDataJob,recruitmentController.createContactJob);

//huy cong viec
router.post('/cancelJob', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 3), recruitmentController.checkDataJob,recruitmentController.createCancelJob);

//truot ung vien
router.post('/failJob', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 3), recruitmentController.checkDataJob,recruitmentController.createFailJob);

//them lich phong van gui mail
router.post('/scheduleInter', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 3), recruitmentController.checkDataJob,recruitmentController.createScheduleInterview);

module.exports = router;