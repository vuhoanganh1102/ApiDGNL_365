var express = require('express');
var router = express.Router();
var formData = require('express-form-data');
var organizationalStructure = require('../../controllers/hr/organizationalStructure');
const { uploadSignature } = require('../../services/hr/hrService');
const functions = require('../../services/functions')

//thông tin công ty, phòng ban
router.post('/detailInfoCompany', formData.parse(), functions.checkToken, organizationalStructure.detailInfoCompany)

//hiển thị mô tả chi tiết phòng ban, tổ nhóm
router.post('/description', formData.parse(), functions.checkToken, organizationalStructure.description)

//cập nhật mô tả chi tiết phòng ban, tổ nhóm
router.post('/updateDescription', formData.parse(), functions.checkToken, organizationalStructure.updateDescription)

//danh sách chức vụ
router.post('/listPosition', formData.parse(), functions.checkToken, organizationalStructure.listPosition)

//hiển thị nhiệm vụ mỗi chức vụ
router.post('/missionDetail', formData.parse(), functions.checkToken, organizationalStructure.missionDetail)

//cập nhật nhiệm vụ mỗi chức vụ
router.post('/updateMission', formData.parse(), functions.checkToken, organizationalStructure.updateMission)

//tải lên chữ ký 
router.post('/uploadSignature', functions.checkToken, uploadSignature.single('file'), organizationalStructure.uploadSignature)

//xóa chữ ký
router.post('/deleteSignature', formData.parse(), functions.checkToken, organizationalStructure.deleteSignature)

//danh sách lãnh đạo
router.post('/listInfoLeader', formData.parse(), functions.checkToken, organizationalStructure.listInfoLeader)

//chi tiết lãnh đạo
router.post('/leaderDetail', formData.parse(), functions.checkToken, organizationalStructure.leaderDetail)

//cập nhật chi tiết lãnh đạo
router.post('/updateLeaderDetail', formData.parse(), functions.checkToken, organizationalStructure.updateLeaderDetail)

//cập nhật nhân viên sử dụng con dấu
router.post('/updateEmpUseSignature', formData.parse(), functions.checkToken, organizationalStructure.updateEmpUseSignature)

//danh sách, tìm kiếm nhân viên sử dụng con dấu
router.post('/listEmpUseSignature', formData.parse(), functions.checkToken, organizationalStructure.listEmpUseSignature)

//xóa nhân viên được sử dụng con dấu
router.post('/deleteEmpUseSignature', formData.parse(), functions.checkToken, organizationalStructure.deleteEmpUseSignature)

//danh sách chữ ký lãnh đạo
router.post('/listSignatureLeader', formData.parse(), functions.checkToken, organizationalStructure.deleteEmpUseSignature)

module.exports = router;