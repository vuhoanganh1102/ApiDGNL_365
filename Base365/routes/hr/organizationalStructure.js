var express = require('express');
var router = express.Router();
var formData = require('express-form-data');
var organizationalStructure = require('../../controllers/hr/organizationalStructure');
const functions = require('../../services/functions')

//thông tin công ty, phòng ban
router.post('/detailInfoCompany', formData.parse(), organizationalStructure.detailInfoCompany)

//thông tin tổ theo phòng ban
router.post('/detailInfoNest', formData.parse(), organizationalStructure.detailInfoNest)

//hiển thị mô tả chi tiết phòng ban, tổ nhóm
router.post('/description', formData.parse(), organizationalStructure.description)



module.exports = router;