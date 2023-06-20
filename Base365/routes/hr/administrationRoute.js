var express = require('express');
var router = express.Router();
var formData = require('express-form-data');
const HR =  require('../../services/hr/hrService');
const administration = require('../../controllers/hr/administrationController')
const functions = require('../../services/functions')
// thêm nhóm quy định
router.post('/addProvision',HR.HR_CheckTokenCompany,formData.parse(),administration.addProvision)

// thêm quy đinh
router.post('/addPolicy',HR.HR_CheckTokenCompany,formData.parse(),administration.addPolicy)

// danh sách nhóm quy định 
router.get('/listProvision',HR.HR_CheckTokenCompany,administration.listProvision)

// chi tiết nhóm quy định 
router.get('/detailProvision',HR.HR_CheckTokenCompany,administration.detailProvision)

// sửa nhóm quy định
router.put('/updateProvision',HR.HR_CheckTokenCompany,formData.parse(),administration.updateProvision)

// xoá nhóm quy định
router.delete('/deleteProvision',HR.HR_CheckTokenCompany,formData.parse(),administration.deleteProvision)

// danh sách quy định theo nhóm quy định
router.get('/listPolicy',HR.HR_CheckTokenCompany,administration.listPolicy)

// chi tiết quy định theo nhóm quy định
router.get('/detailPolicy',HR.HR_CheckTokenCompany,administration.detailPolicy)

// xoá quy định theo nhóm quy định
router.delete('/deletePolicy',HR.HR_CheckTokenCompany,formData.parse(),administration.deletePolicy)


// Thêm mới nhóm chính sách
router.post('/addEmployeePolicy',HR.HR_CheckTokenCompany,formData.parse(),administration.addEmployeePolicy)

// Sửa nhóm chính sách
router.put('/updateEmployeePolicy',HR.HR_CheckTokenCompany,formData.parse(),administration.updateEmployeePolicy)

// xoá nhóm chính sachs nhân viên
router.delete('/deleteEmployeePolicy',HR.HR_CheckTokenCompany,formData.parse(),administration.deleteEmployeePolicy)

// Thêm mới chính sách
router.post('/addEmpoyePolicySpecific',functions.checkToken,formData.parse(),administration.addEmpoyePolicySpecific)

module.exports = router;