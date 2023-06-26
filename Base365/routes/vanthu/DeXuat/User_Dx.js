const express = require('express');
const router = express.Router();
const formData = require('express-form-data');
const controller = require('../../../controllers/vanthu/DeXuat/user_deXuat');
const functions = require('../../../services/functions')

//đề xuất tôi gửi đi 
router.post('/user_send_deXuat_All',functions.checkToken, formData.parse(), controller.deXuat_user_send);
router.get('/user_send_deXuat_cho_duyet',functions.checkToken, formData.parse(), controller.deXuat_userSend_cho_duyet);//đang chờ duyệt 
router.get('/user_send_deXuat_da_duyet',functions.checkToken, formData.parse(), controller.deXuat_userSend_da_duyet);// đã đòng ý 
router.get('/user_send_deXuat_da_tu_choi',functions.checkToken, formData.parse(), controller.deXuat_userSend_da_tu_choi);// đã từ chối 
//đề xuất gửi đến tôi 
router.post('/deXuat_send_user',functions.checkToken, formData.parse(), controller.de_xuat_send_to_me);
router.get('/deXuat_sendToMe_cho_duyet',functions.checkToken, formData.parse(), controller.deXuat_sendToMe_cho_duyet);//dang chờ duyệt 
router.get('/deXuat_sendToMe_da_duyet',functions.checkToken, formData.parse(), controller.deXuat_SendToMe_da_duyet);// đã đòng ý 
router.get('/deXuat_sendToMe_da_tu_choi',functions.checkToken, formData.parse(), controller.deXuat_SendToMe_da_tu_choi);// đã từ chối 
//đề xuất đang theo dõi 

router.post('/deXuat_follow',functions.checkToken, formData.parse(), controller.de_xuat_theo_doi);
router.get('/deXuat_follow_cho_duyet',functions.checkToken, formData.parse(), controller.deXuat_Follow_cho_duyet);//đang chờ duyệt
router.get('/deXuat_follow_da_duyet',functions.checkToken, formData.parse(), controller.deXuat_Follow_da_duyet);// đã đòng ý 
router.get('/deXuat_follow_da_tu_choi',functions.checkToken, formData.parse(), controller.deXuat_Follow_da_tu_choi);// đã từ chối 
router.get('/deXuat_het_han_duyet',functions.checkToken, formData.parse(), controller.deXuat_het_han_duyet)//hết hạn duyệt 

//admin
router.post('/admin_danh_sach_de_xuat',functions.checkToken, formData.parse(), controller.admin_danh_sach_de_xuat);
module.exports = router;