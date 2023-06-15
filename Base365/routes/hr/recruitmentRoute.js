var express = require('express');
var router = express.Router();
var recruitmentController = require('../../controllers/hr/recruitmentController');
var formData = require('express-form-data');
const functions = require('../../services/functions');

//api lay ra danh sach recruitmentController theo cac truong
router.post('/getRecruit', formData.parse(), recruitmentController.getListRecruitment);
router.post('/recruit', formData.parse(), recruitmentController.createRecruitment);

module.exports = router;