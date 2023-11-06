var express = require('express');
var router = express.Router();
var admin = require('../../controllers/timviec/admin');
var formData = require('express-form-data');
const functions = require('../../services/functions');

// api đăng nhập
router.post('/check/login', formData.parse(), admin.login);

// api lấy dữ liệu modules
router.post('/getModules', formData.parse(), admin.getModules);

// api check quyền truy cập 
router.post('/check/accessmodule', formData.parse(), admin.accessmodule);
// api lấy dữ liệu admin qua adm_bophan
router.post('/getInfoAdminUser', formData.parse(), admin.getInfoAdminUser);

router.post('/translate', admin.translate);

// api lấy dữ liệu admin
router.post('/infor', formData.parse(), admin.infor);
router.post('/bophan/list', formData.parse(), admin.bophan_list);

// Công ty
router.post('/company/listing', formData.parse(), admin.listingCompany);


// api đăng ký admin
router.post('/postNewAdmin', formData.parse(), admin.postAdmin);

// api cập nhập admin
router.post('/updateAdmin', functions.checkToken, formData.parse(), admin.updateAdmin);

// api lấy thông tin chi tiết admin
router.post('/getAdminDetail', functions.checkToken, formData.parse(), admin.getAdminDetail);

// api lấy danh sách admin
router.post('/getListAdmin', functions.checkToken, formData.parse(), admin.getListAdmin);

// api xóa admin  
router.post('/deleteAdmin', functions.checkToken, formData.parse(), admin.deleteAdmin);

// api cập nhập active    
router.post('/updateActive', functions.checkToken, formData.parse(), admin.updateActive);

// api cập nhập password    
router.post('/updatePassword', functions.checkToken, formData.parse(), admin.updatePassword);

// luồng ứng viên
router.post('/uv/list/regis', formData.parse(), admin.candi_register);

router.post('/topupCredits', formData.parse(), functions.checkToken, admin.topupCredits);

module.exports = router;