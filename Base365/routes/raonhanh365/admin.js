var express = require('express');
var router = express.Router();
var admin = require('../../controllers/raonhanh365/admin');
var formData = require('express-form-data');
const functions = require('../../services/functions');
const serviceRN = require('../../services/rao nhanh/raoNhanh');


//api quan ly tai khoan
router.post('/account/createAcc', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.loginAdminUser);


//api quan ly danh muc
router.post('/category/getListCate', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.getListCategory);

// //api quan ly tin tuyen dung
// router.post('/new', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], )

//api danh sách và tìm kiếm giá ghim tin đăng
router.post('/priceList/getListPricePin', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365],admin.getListNewWithPin );

//api thêm mới giá ghim tin đăng
router.post('/priceList/createPricePin',formData.parse(), [functions.checkToken, serviceRN.isAdminRN365],admin.createNewWithPin);

//api sửa giá tin đăng
router.put('/priceList/putPricePin/:id',formData.parse(), [functions.checkToken, serviceRN.isAdminRN365],admin.putNewWithPin);


//api danh sách và tìm kiếm Giá đẩy tin đăng
router.post('/priceList/getListPricePush', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365],admin.getListPushNew );

//api thêm mới giá đẩy tin đăng
router.post('/priceList/getListPricePush', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365],admin.createNewWithPush );

//api sửa giá đẩy tin đăng dựa vào id
router.put('/priceList/getListPricePush/:id',formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.putNewWithPin);

// api danh sách và tìm kiếm blog
router.post('/blograonhanh365',formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.listBlog);

// api sửa blog
router.put('/blograonhanh365/:blogId',formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.putBlog);

// api thêm mới blog
router.post('/blograonhanh365/create',formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.createBlog);

//api danh sách lỗi đăng ký
router.post('/failRegisterUser',formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.failRegister);

module.exports = router;

