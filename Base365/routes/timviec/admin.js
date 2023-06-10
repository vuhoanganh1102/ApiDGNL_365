var express = require('express');
var router = express.Router();
var admin = require('../../controllers/timviec/admin');
var formData = require('express-form-data');
const functions = require('../../services/functions');

// api lấy dữ liệu modules
router.post('/getDataModules', admin.getModules);

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

//login admin
router.post('/loginAdmin', formData.parse(), admin.loginAdmin);

//thêm mới danh mục
router.post('/addCategory', functions.checkToken, formData.parse(), admin.addCategory);

//hiển thị danh mục
router.post('/listCategory', functions.checkToken, formData.parse(), admin.listCategory);

//thêm mới danh mục blog
router.post('/addCategoryBlog', functions.checkToken, formData.parse(), admin.addCategoryBlog);

//danh sách danh mục blog
router.post('/listCategoryBlog', functions.checkToken, formData.parse(), admin.listCategoryBlog);

//cập nhật blog
router.post('/updateCategoryBlog', functions.checkToken, formData.parse(), admin.updateCategoryBlog);

//cập nhật active blog
router.post('/updateActiveCategoryBlog', functions.checkToken, formData.parse(), admin.updateActiveCategoryBlog);


module.exports = router;