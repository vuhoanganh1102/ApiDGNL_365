var express = require('express');
var router = express.Router();
var recruitmentController = require('../../controllers/hr/recruitmentController');
var formData = require('express-form-data');
const functions = require('../../services/functions');

//api lay ra danh sach recruitmentController theo cac truong
router.post('/getStageRecruit', formData.parse(), recruitmentController.getListStageRecruitment);

module.exports = router;