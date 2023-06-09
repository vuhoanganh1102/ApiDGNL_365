var express = require('express');
var router = express.Router();
var admin = require('../../controllers/raonhanh365/admin');
var formData = require('express-form-data');
const functions = require('../../services/functions');
const serviceRN = require('../../services/rao nhanh/raoNhanh');


//------------------------------------------------api quan ly tai khoan admin
router.post('/account/createAcc', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.loginAdminUser);
router.post('/account/getListAdmin', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.getListAdminUser);
router.post('/account/createAdmin', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365],admin.getAndCheckDataAdminUser, admin.createAdminUser);
router.put('/account/updateAdmin', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.getAndCheckDataAdminUser, admin.updateAdminUser);

//------------------------------------------------api quan ly danh muc
router.post('/category/getListCate', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.getListCategory);
router.post('/category/createCate', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.getAndCheckDataCategory, admin.createCategory);
router.put('/category/updateCate', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.getAndCheckDataCategory, admin.updateCategory);

//------------------------------------------------api quan ly tin(tin rao vat, tin mua)
router.post('/news/getListNews', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.getListNews);
router.put('/news/updateNews', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.getAndCheckDataNews, admin.updateNews);
router.delete('/news/deleteNews', [functions.checkToken, serviceRN.isAdminRN365], admin.deleteNews);

//------------------------------------------------api quan ly bang gia(gia ghim gian hang)
router.post('/priceList/getListPriceList', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.getListPriceList);

//------------------------------------------------api quan ly tai khoan(tai khoan chua xac thuc va da xac thuc)
router.post('/user/getListUser', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.getListUser);
router.put('/user/updateUser', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.getAndCheckDataUser, admin.updateUser);
router.delete('/user/deleteUser', [functions.checkToken, serviceRN.isAdminRN365], admin.deleteUser);

//------------------------------------------------api blog
router.post('/blog/getListBlog', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.getListBlog);
router.post('/blog/createBlog', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.getAndCheckDataBlog, admin.createBlog);
router.put('/blog/updateBlog', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.getAndCheckDataBlog, admin.updateBlog);




//------------------------------------------------api giá ghim tin đăng
//api danh sách và tìm kiếm giá ghim tin đăng
router.post('/priceList/getListPricePin', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365],admin.getListNewWithPin );

//api thêm mới giá ghim tin đăng
router.post('/priceList/createPricePin',formData.parse(), [functions.checkToken, serviceRN.isAdminRN365],admin.createNewWithPin);

//api sửa giá tin đăng
router.put('/priceList/putPricePin/:id',formData.parse(), [functions.checkToken, serviceRN.isAdminRN365],admin.putNewWithPin);



//------------------------------------------------api giá đẩy tin đăng
//api danh sách và tìm kiếm Giá đẩy tin đăng
router.post('/priceList/getListPricePush', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365],admin.getListPushNew );

//api thêm mới giá đẩy tin đăng
router.post('/priceList/getListPricePush', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365],admin.createNewWithPush );

//api sửa giá đẩy tin đăng dựa vào id
router.put('/priceList/getListPricePush/:id',formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.putNewWithPin);


//------------------------------------------------api danh sách lỗi đăng ki
//api danh sách lỗi đăng ký
router.post('/failRegisterUser',formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.failRegister);

module.exports = router;

