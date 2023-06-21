var express = require('express');
var router = express.Router();
var formData = require('express-form-data');
var organizationalStructure = require('../../controllers/hr/organizationalStructure');
const functions = require('../../services/functions')

//thông tin công ty, phòng ban
router.post('/detailInfoCompany', formData.parse(), organizationalStructure.detailInfoCompany)

//hiển thị mô tả chi tiết phòng ban, tổ nhóm
router.post('/description', formData.parse(), organizationalStructure.description)

//cập nhật mô tả chi tiết phòng ban, tổ nhóm
router.post('/updateDescription', formData.parse(), organizationalStructure.updateDescription)



module.exports = router;