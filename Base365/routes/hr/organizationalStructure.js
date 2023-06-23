var express = require('express');
var router = express.Router();
var formData = require('express-form-data');
var organizationalStructure = require('../../controllers/hr/organizationalStructure');
const { uploadSignature } = require('../../services/hr/hrService');
const functions = require('../../services/functions')

//thông tin công ty, phòng ban
router.post('/detailInfoCompany', formData.parse(), organizationalStructure.detailInfoCompany)

//hiển thị mô tả chi tiết phòng ban, tổ nhóm
router.post('/description', formData.parse(), organizationalStructure.description)

//cập nhật mô tả chi tiết phòng ban, tổ nhóm
router.post('/updateDescription', formData.parse(), organizationalStructure.updateDescription)

//danh sách chức vụ
router.post('/listPosition', formData.parse(), organizationalStructure.listPosition)

//hiển thị nhiệm vụ mỗi chức vụ
router.post('/missionDetail', formData.parse(), organizationalStructure.missionDetail)

//cập nhật nhiệm vụ mỗi chức vụ
router.post('/updateMission', formData.parse(), organizationalStructure.updateMission)

//tải lên chữ ký 
router.post('/uploadSignature', functions.checkToken, uploadSignature.single('file'), organizationalStructure.uploadSignature)

//xóa chữ ký
router.post('/deleteSignature', formData.parse(), functions.checkToken, organizationalStructure.deleteSignature)

//danh sách lãnh đạo
router.post('/listInfoLeader', formData.parse(), functions.checkToken, organizationalStructure.listInfoLeader)


module.exports = router;