var express = require('express');
var router = express.Router();
var recruitmentController = require('../../controllers/hr/recruitmentController');
var formData = require('express-form-data');
const functions = require('../../services/functions');

//api lay ra danh sach recruitmentController theo cac truong
router.post('/getRecruit', formData.parse(), recruitmentController.getListRecruitment);
router.post('/', formData.parse(), recruitmentController.createRecruitment);
router.put('/', formData.parse(), recruitmentController.updateRecruitment);

//xoa quy trinh tuyen dung vao muc da xoa gan day
router.put('/statusDelete', formData.parse(), recruitmentController.updateStatusDeleteRecruitment);
//xoa vinh vien
router.delete('/', formData.parse(), recruitmentController.deleteRecruitment);

module.exports = router;