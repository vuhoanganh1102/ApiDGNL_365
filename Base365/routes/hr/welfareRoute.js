var express = require('express');
var router = express.Router();
var formData = require('express-form-data');
var walfare  = require('../../controllers/hr/walfareController');
const HR =  require('../../services/hr/hrService');

// thêm khen thưởng cá nhân
router.post('/addAchievement',HR.HR_CheckTokenCompany,formData.parse(),walfare.addAchievement)

// thêm khen thưởng tập thể
router.post('/addAchievementGroup',HR.HR_CheckTokenCompany,formData.parse(),walfare.addAchievementGroup)

// sửa khen thưởng
router.put('/updateAchievement',HR.HR_CheckTokenCompany,formData.parse(),walfare.updateAchievement)

// danh sách khen thưởng 
router.get('/listAchievement',HR.HR_CheckTokenCompany,walfare.listAchievement)

// Thêm mới kỉ luật cá nhân 
router.post('/addInfinges',HR.HR_CheckTokenCompany,formData.parse(),walfare.addInfinges)

// Thêm mới kỉ luật cá nhân 
router.post('/addInfingesGroup',HR.HR_CheckTokenCompany,formData.parse(),walfare.addInfingesGroup)

// sửa  kỉ luật
router.put('/updatec',HR.HR_CheckTokenCompany,formData.parse(),walfare.updateInfinges)

// danh sách kỉ luật
router.get('/listInfinges',HR.HR_CheckTokenCompany,walfare.listInfinges)

module.exports = router;