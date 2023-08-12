var express = require('express');
var router = express.Router();
const controller =  require('../../controllers/giasu/postNews');
const formData = require("express-form-data")
const functions = require('../../services/functions');

//dang tin
router.post('/postFindTeacher',functions.checkToken, formData.parse(), controller.post);
//sua dang tin
router.post('/edit',functions.checkToken, formData.parse(), controller.editPost);
//cho phep tim kiem
router.post('/allowSearchTeacher',functions.checkToken, formData.parse(), controller.allowSearchTeacher);
//lam moi gia su
router.post('/refreshTeacher',functions.checkToken, formData.parse(), controller.refreshTeacher);
//lam moi lop hoc
router.post('/refreshClass',functions.checkToken, formData.parse(), controller.refreshClass);
//xoa thong bao
router.post('/deleteNoti',functions.checkToken, formData.parse(), controller.deleteNoti);
//PH mời GS
router.post('/ParentInvite',functions.checkToken, formData.parse(), controller.ParentInvite);
//kiem tra tieu de
router.post('/checkTittle',functions.checkToken, formData.parse(), controller.checkTittle);
//cap nhat trang thai lop hoc
router.post('/updateStatus',functions.checkToken, formData.parse(), controller.updateStatus);
//huy luu Gia Su
router.post('/unsaveTeacher',functions.checkToken, formData.parse(), controller.unsave_teacher);
// luu Gia Su
router.post('/saveTeacher',functions.checkToken, formData.parse(), controller.saveTeacher);
//danh sach thanh pho
router.post('/listCity',functions.checkToken, formData.parse(), controller.listCity);
//danh sach quan huyen
router.post('/listDistrict',functions.checkToken, formData.parse(), controller.listDistrict);
//danh sach lop hoc
router.post('/listClassTeach',functions.checkToken, formData.parse(), controller.listClassTeach);
//danh sach mon hoc
router.post('/listAllSubject',functions.checkToken, formData.parse(), controller.listAllSubject);
//chi tiet
router.post('/detail',functions.checkToken, formData.parse(), controller.detail);


module.exports = router;