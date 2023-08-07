var express = require('express');
var router = express.Router();
var admin = require('../../controllers/raonhanh365/admin');
var formData = require('express-form-data');
const functions = require('../../services/functions');
const serviceRN = require('../../services/raoNhanh365/service');
var news = require('../../controllers/raonhanh365/new');
var blog = require('../../controllers/raonhanh365/blog');

//------------------------------------------------api quan ly tai khoan admin
router.post('/loginAdmin', formData.parse(), admin.loginAdminUser);
router.post('/changePasswordAdminLogin', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.changePasswordAdminLogin);
router.post('/changeInfoAdminLogin', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.changeInfoAdminLogin);
router.post('/getSideBar', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.getSideBar);
router.post('/listModule', formData.parse(), functions.checkToken, admin.listModule);

router.post('/account/getListAdmin', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.getListAdminUser);
router.post('/account/createAdmin', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365, serviceRN.checkRight(27, 2)], admin.createAdminUser);
router.post('/account/updateAdmin', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365, serviceRN.checkRight(27, 3)], admin.updateAdminUser);
router.post('/account/changePassword', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365, serviceRN.checkRight(27, 3)], admin.changePassword);

//------------------------------------------------api quan ly danh muc
router.post('/category/getListCate', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.getListCategory);
router.post('/category/createCate', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365, serviceRN.checkRight(15, 2)], admin.getAndCheckDataCategory, admin.createCategory);
router.post('/category/updateCate', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365, serviceRN.checkRight(15, 3)], admin.getAndCheckDataCategory, admin.updateCategory);
router.post('/category/activeAndShowCategory', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365, serviceRN.checkRight(15, 3)], admin.activeAndShowCategory);

//------------------------------------------------api quan ly tin(tin rao vat, tin mua)
router.post('/news/getListNews', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.getListNews);
router.post('/news/updateNews', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365, serviceRN.checkRight(14, 3)], admin.getAndCheckDataNews, admin.updateNews);
router.post('/news/deleteNews', [functions.checkToken, serviceRN.isAdminRN365, serviceRN.checkRight(14, 4)], admin.deleteNews);
router.post('/news/pinNews', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365, serviceRN.checkRight(14, 3)], news.pinNews);
router.post('/news/pushNews', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365, serviceRN.checkRight(14, 3)], news.pushNews);

//------------------------------------------------api giá ghim tin đăng and giá đẩy tin đăng
router.post('/getListPrice', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.getListPrice);
router.post('/createPriceListPin', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365, serviceRN.checkRight(22, 2)], admin.createAndUpdatePriceListPin);
router.post('/updatePriceListPin', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365, serviceRN.checkRight(22, 3)], admin.createAndUpdatePriceListPin);

router.post('/updatePriceListPush', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365, serviceRN.checkRight(32, 3)], admin.updatePriceListPush);

//------------------------------------------------api quan ly tai khoan(tai khoan chua xac thuc va da xac thuc)
router.post('/user/getListUser', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.getListUser);
router.post('/user/updateUser', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365, serviceRN.checkRight(23, 3)], admin.getAndCheckDataUser, admin.updateUser);
router.post('/user/deleteUser', [functions.checkToken, serviceRN.isAdminRN365, serviceRN.checkRight(23, 4)], admin.deleteUser);

//------------------------------------------------api blog
router.post('/blog/getListBlog', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.getListBlog);
router.post('/blog/createBlog', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365, serviceRN.checkRight(37, 2)], admin.getAndCheckDataBlog, admin.createBlog);
router.post('/blog/updateBlog', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365, serviceRN.checkRight(37, 3)], admin.getAndCheckDataBlog, admin.updateBlog);
// router.post('/blog/hotBlog', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.hotBlog);

//------------------------------------------------api lich su nap the---------------------------------------------------
router.post('/getListHistory', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.getListHistory);

//-----------------------------------------------tin spam
router.post('/getListNewsSpam', [functions.checkToken, serviceRN.isAdminRN365], admin.getListNewsSpam);

//------------------------------------------------duyet tin
router.post('/danhSachTinCanDuyet', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.danhSachTinCanDuyet);
router.post('/duyetTin', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.duyetTin);

//------------------------------------------------api báo cáo tin
// api tạo mới tin báo cáo
router.post('/newReportt', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365, serviceRN.checkRight(31, 2)], admin.createReport);
// api danh sách và tìm kiếm báo cáo tin
router.post('/listReportNew', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.listReportNew);
// api sửa tin dựa vào param
router.post('report/fixNewReport', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.fixNewReport);

//------------------------------------------------api danh sách lỗi đăng ki
router.post('/failRegisterUser', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.failRegisterUser);

//------------------------------------------------api chiết khấu nạp thẻ
router.post('/getListDiscountCard', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.getListDiscountCard);
router.post('/updateDiscountCard', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365, serviceRN.checkRight(39, 2)], admin.updateDiscountCard);

//------------------------------------------------api xac thuc thanh toan dam bao
router.post('/getUserVerifyPayment', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.getListUserVerifyPayment);
router.post('/verifyPayment', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.adminVerifyPayment);

//-----------------------------------------------api nguoi mua xac nhan thanh toan
router.post('/getListOrderPayment', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.getListOrderPayment);
router.post('/verifyOrder', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.adminVerifyOrder);

//----------------------------------------------api tags index
router.post('/tagsIndex', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.getListTagsIndex);

router.post('/active', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.active);
router.post('/deleleManyByModule', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.deleleManyByModule);

module.exports = router;